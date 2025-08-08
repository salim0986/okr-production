import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { requireAuth } from "@/app/api/utils/authGuard";
import supabase from "@/app/api/utils/db";
import { UserPayload } from "@/app/api/types/auth/authTypes";
import { Role } from "@/app/api/types/auth/roles";

export const POST = requireAuth(
  [Role.ORG_ADMIN],
  async (req: NextRequest, user: UserPayload) => {
    const body = await req.json();
    const { name, email, password, role, team_id } = body;

    // Validate role
    if (![Role.TEAM_LEAD, Role.EMPLOYEE].includes(role)) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid role; must be team_lead or employee",
        }),
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !password || !team_id) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields: name, email, password, team_id",
        }),
        { status: 400 }
      );
    }

    // Verify that team exists in admin's organization
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, lead_id")
      .eq("id", team_id)
      .eq("organization_id", user.organization_id)
      .single();

    if (teamError || !team) {
      return new NextResponse(
        JSON.stringify({ error: "Team not found or not in your organization" }),
        { status: 404 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const { data: users, error: userError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role,
          team_id,
          organization_id: user.organization_id,
        },
      ])
      .select("id, name, email, role, team_id")
      .single();

    if (userError || !users) {
      return new NextResponse(
        JSON.stringify({ error: userError?.message || "User creation failed" }),
        { status: 500 }
      );
    }

    // If the new user is a TEAM_LEAD, update the team's lead_id
    if (role === Role.TEAM_LEAD) {
      const { error: updateError } = await supabase
        .from("teams")
        .update({ lead_id: users.id })
        .eq("id", team_id)
        .eq("organization_id", user.organization_id);

      if (updateError) {
        // Roll back user creation if you want, or just warn
        return new NextResponse(
          JSON.stringify({
            message: "User created but failed to set team lead on team",
            user: users,
            error: updateError.message,
          }),
          { status: 500 }
        );
      }
    }

    return new NextResponse(
      JSON.stringify({ message: "User created successfully", user: users }),
      { status: 201 }
    );
  }
);
