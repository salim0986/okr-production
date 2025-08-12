import supabase from "@/app/api/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/app/api/utils/auth";

export async function POST(req: NextRequest) {
  const { email, orgName, password, name, role, organization_id, team_id } =
    await req.json();

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert([
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
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (role === "admin") {
    const { data, error } = await supabase.from("organizations").insert([
      {
        name: orgName || "",
        created_by: user.id,
      },
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { data: organization } = await supabase
      .from("organizations")
      .select("*")
      .eq("created_by", user.id)
      .maybeSingle();

    user.organization_id = organization.id;
  }

  const token = signToken({
    name,
    email,
    role,
    id: user.id,
    organization_id: user.organization_id,
    team_id: user.team_id,
  });

  return NextResponse.json({ token }, { status: 201 });
}
