import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/api/utils/authGuard";
import supabase from "@/app/api/utils/db";
import { Role } from "@/app/api/types/auth/roles";
import { UserPayload } from "@/app/api/types/auth/authTypes";

export const GET = requireAuth(
  [Role.ORG_ADMIN],
  async (_req: NextRequest, user: UserPayload) => {
    // 1. Load all teams in the org, along with their lead, members, and objectives
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select(
        `
        id,
        name,
        team_lead:users!teams_lead_id_fkey(id, name),
        users:users!users_team_id_fkey(id),
        objectives:objectives!fk_objectives_team_id(id, status)
      `
      )
      .eq("organization_id", user.organization_id);

    if (teamsError) {
      return NextResponse.json({ error: teamsError.message }, { status: 500 });
    }

    // 2. Compute metrics per team
    const insights = (teams || []).map((t) => {
      const total = t.objectives?.length || 0;
      const completed =
        t.objectives?.filter((o) => o.status === "completed").length || 0;

      const completionPercent =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      // aggregate status: overdue > at_risk > ahead > on_track
      const priority = ["overdue", "at_risk", "ahead", "on_track"];
      const statuses = t.objectives?.map((o) => o.status) || [];
      const status =
        statuses.find((s) => s === "overdue") ||
        statuses.find((s) => s === "at_risk") ||
        statuses.find((s) => s === "ahead") ||
        "on_track";

      return {
        team: t.name,
        lead: t.team_lead[0]?.name || null,
        members: t.users?.length || 0,
        completion: completionPercent,
        status,
      };
    });

    // 3. Return top 10 by completion desc
    insights.sort((a, b) => b.completion - a.completion);
    return NextResponse.json(insights.slice(0, 10), { status: 200 });
  }
);
