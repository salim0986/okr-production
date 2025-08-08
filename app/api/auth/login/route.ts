import supabase from "@/app/api/utils/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/app/api/utils/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (!user || error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Update last_login to current timestamp
  await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", user.id)
    .neq("is_deleted", true);

  const token = signToken({
    email: user.email,
    role: user.role,
    id: user.id,
    organization_id: user.organization_id,
    team_id: user.team_id,
  });

  return NextResponse.json({ token }, { status: 200 });
}
