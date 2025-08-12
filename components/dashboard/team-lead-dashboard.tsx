"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, TrendingUp, Clock, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QuickInsights = {
  teamMembers: number;
  teamOkrs: { total: number; completed: number };
  teamProgress: number;
  pendingReviews: number;
};

type MemberInsight = {
  id: string;
  member: { name: string; title?: string | null };
  team: string;
  okrs: number;
  progress: number;
  status: string; // "ahead" | "on_track" | "at_risk" | ...
  last_login?: string | null;
};

type PendingCheckin = {
  id: string;
  key_result_id: string;
  user_id: string;
  progress_value: number;
  comment?: string | null;
  check_in_date?: string;
  created_at?: string;
};

export function TeamLeadDashboard() {
  const { user } = useAuth();
  const teamId = user?.team_id;

  const [quick, setQuick] = useState<QuickInsights | null>(null);
  const [members, setMembers] = useState<MemberInsight[]>([]);
  const [pending, setPending] = useState<PendingCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchQuick = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetch(`/api/dashboard/team-lead/${teamId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to fetch quick insights");
      const data = await res.json();
      setQuick(data);
    } catch (err) {
      console.error(err);
    }
  }, [teamId, token]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard/team-lead/insights`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to fetch members insights");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchPending = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkins/pending`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to fetch pending check-ins");
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([fetchQuick(), fetchMembers(), fetchPending()]);
    setLoading(false);
  }, [fetchQuick, fetchMembers, fetchPending]);

  useEffect(() => {
    if (!teamId) return;
    fetchAll();
  }, [teamId, fetchAll]);

  const statusLabel = (s?: string) => {
    if (!s) return "Unknown";
    switch (s.toLowerCase()) {
      case "ahead":
        return "Ahead";
      case "on_track":
      case "on track":
        return "On Track";
      case "at_risk":
      case "at risk":
        return "At Risk";
      case "behind":
        return "Behind";
      default:
        return s;
    }
  };

  const isPositiveStatus = (s?: string) => {
    if (!s) return false;
    return ["ahead", "on_track", "on track"].includes(s.toLowerCase());
  };

  const handleCheckinAction = async (
    keyResultId: string,
    checkInId: string,
    status: "approved" | "rejected"
  ) => {
    // Guard
    if (!keyResultId || !checkInId) return;
    setActionLoading((p) => ({ ...p, [checkInId]: true }));
    try {
      const res = await fetch(
        `/api/key-results/${keyResultId}/check-ins/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status, checkInId }),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update check-in status");
      }
      // refresh pending and quick metrics (and table if needed)
      await Promise.all([fetchPending(), fetchQuick(), fetchMembers()]);
    } catch (err) {
      console.error("Action failed:", err);
      // optionally show UI feedback
    } finally {
      setActionLoading((p) => ({ ...p, [checkInId]: false }));
    }
  };

  // Map pending check-ins to include member name (if available)
  const pendingWithMember = pending.map((p) => {
    const member = members.find((m) => m.id === p.user_id);
    return {
      ...p,
      memberName: member?.member?.name ?? member?.member ?? "Unknown",
      okrName: undefined as string | undefined, // not available from pending endpoint; show KR id
    };
  });

  // UI skeleton while loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex items-center justify-between pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded w-28 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" /> Team Members Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-100 rounded animate-pulse h-16"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Build metrics for top cards
  const metrics = [
    {
      title: "Team Members",
      value: quick?.teamMembers ?? 0,
      icon: Users,
      change: undefined,
    },
    {
      title: "Team OKRs",
      value: quick?.teamOkrs?.total ?? 0,
      icon: Target,
      change: quick ? `${quick.teamOkrs.completed} completed` : undefined,
    },
    {
      title: "Team Progress",
      value: `${quick?.teamProgress ?? 0}%`,
      icon: TrendingUp,
      change: undefined,
    },
    {
      title: "Pending Reviews",
      value: quick?.pendingReviews ?? 0,
      icon: Clock,
      change: undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} className="neumorph-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{m.value}</div>
                {m.change && (
                  <p className="text-xs text-muted-foreground">{m.change}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Members Performance */}
        <div className="lg:col-span-2">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Team Members Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>OKRs</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length > 0 ? (
                    members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{m.member?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.member?.title ?? m.team}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{m.okrs}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={m.progress} className="w-16 h-2" />
                            <span className="text-sm">{m.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              isPositiveStatus(m.status)
                                ? "default"
                                : "destructive"
                            }
                            className={
                              m.status === "ahead"
                                ? "status-on-track"
                                : m.status === "on_track"
                                ? "status-on-track"
                                : m.status === "at_risk"
                                ? "status-at-risk"
                                : "status-blocked"
                            }
                          >
                            {statusLabel(m.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {m.last_login
                            ? new Date(m.last_login).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>View OKRs</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>Schedule 1:1</DropdownMenuItem>
                              <DropdownMenuItem>Assign OKR</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-sm text-muted-foreground"
                      >
                        No member data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <div>
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingWithMember.length > 0 ? (
                pendingWithMember.map((p) => (
                  <div
                    key={p.id}
                    className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.memberName}</p>
                        <p className="text-xs text-muted-foreground">
                          KR: {p.key_result_id}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.check_in_date ?? p.created_at
                          ? new Date(
                              p.created_at ?? p.check_in_date!
                            ).toLocaleString()
                          : ""}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={Math.max(
                            0,
                            Math.min(100, Number(p.progress_value ?? 0))
                          )}
                          className="w-16 h-1"
                        />
                        <span className="text-xs">{p.progress_value}%</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          type="button"
                          onClick={() =>
                            handleCheckinAction(
                              p.key_result_id,
                              p.id,
                              "approved"
                            )
                          }
                          disabled={!!actionLoading[p.id]}
                        >
                          {actionLoading[p.id] ? "..." : "Approve"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          type="button"
                          onClick={() =>
                            handleCheckinAction(
                              p.key_result_id,
                              p.id,
                              "rejected"
                            )
                          }
                          disabled={!!actionLoading[p.id]}
                        >
                          {actionLoading[p.id] ? "..." : "Reject"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No pending check-ins
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
