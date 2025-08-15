import supabase from "@/app/api/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/app/api/utils/auth";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, orgName, password, name, role, organization_id, team_id } =
    await req.json();

  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const { error: insertError } = await supabase.from("users").insert([
    {
      email,
      password: hashedPassword,
      name,
      role: role || "employee",
      last_login: new Date(),
      organization_id,
      team_id,
    },
  ]);
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Fetch newly created user
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  // If admin, create org
  if (role === "admin") {
    const { error: orgError } = await supabase.from("organizations").insert([
      {
        name: orgName || "",
        created_by: user.id,
      },
    ]);
    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 500 });
    }

    const { data: organization } = await supabase
      .from("organizations")
      .select("*")
      .eq("created_by", user.id)
      .maybeSingle();

    user.organization_id = organization.id;
  }

  // Your normal app token (keeps `role` as is)
  const appToken = signToken({
    name: user.name,
    email: user.email,
    role: user.role, // employee | team_lead | admin
    id: user.id,
    organization_id: user.organization_id,
    team_id: user.team_id,
  });

  // Supabase Realtime token (role must be "authenticated")
  const supabaseToken = signToken({
    sub: user.id,
    aud: "authenticated",
    role: "authenticated", // Supabase requirement
    my_role: user.role, // optionally still pass your role for RLS
  });

  return NextResponse.json(
    {
      token: appToken,
      supabaseToken, // frontend uses this ONLY for Realtime
    },
    { status: 201 }
  );
}
