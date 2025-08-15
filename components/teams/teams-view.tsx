"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  description?: string;
  members_count: number;
  active_okrs_count: number;
  average_progress: number;
  status: string;
  team_lead: { id: string; name: string };
}

interface Member {
  id: string;
  member: { name: string; title: string | null };
  team: string;
  okrs: number;
  progress: number;
  status: "on_track" | "ahead" | "at_risk" | "behind";
  last_active: string;
}

/* Presentation-only status colors (orangish theme for at-risk, warm accents) */
function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "on_track":
    case "on track":
      return "bg-[#EEF8FF] text-[#2563EB]"; // light blue bg, blue text
    case "ahead":
      return "bg-[#ECFDF5] text-[#059669]"; // light green
    case "at_risk":
    case "at risk":
      return "bg-[#FFF2EB] text-[#FF8A5B]"; // soft orange
    case "behind":
      return "bg-[#FFF1F2] text-[#DC2626]"; // soft red
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

function statusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "on_track":
    case "on track":
      return "On Track";
    case "ahead":
      return "Ahead";
    case "at_risk":
    case "at risk":
      return "At Risk";
    case "behind":
      return "Behind";
    default:
      return status;
  }
}

export function TeamsView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"teams" | "members">(
    user?.role === "admin" ? "teams" : "members"
  );
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (!user?.organization_id) return;

    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const res = await fetch(
          `/api/teams/by-organization/${user?.organization_id}`
        );
        const data: Team[] = await res.json();
        setTeams(data);
        setLoadingTeams(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to fetch teams!",
          variant: "destructive",
        });
      }
    };

    fetchTeams();
  }, [user?.organization_id, open]);

  useEffect(() => {
    if (activeTab !== "members" || !teams.length) return;

    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const token = localStorage.getItem("token");
        let res;
        if (user?.role == "admin") {
          res = await fetch(
            `/api/organizations/${user?.organization_id}/members`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          res = await fetch(`/api/teams/${user?.team_id}/members`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        if (!res.ok) {
          toast({
            title: "Failed",
            description: "Failed to fetch members, try again...",
            variant: "destructive",
          });
          setLoadingMembers(false);
          return;
        }

        const data: Member[] = await res.json();
        setMembers(data);
        setLoadingMembers(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to fetch members!",
          variant: "destructive",
        });
      }
    };

    fetchMembers();
  }, [activeTab, teams]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold text-zinc-900">
            Teams & People
          </h2>
          <p className="text-sm text-zinc-500">
            Manage teams and track members performance
          </p>
        </div>
        {user?.role === "admin" && (
          <div>
            <Button
              variant="default"
              onClick={() => setOpen(true)}
              className="bg-[#FF8A5B] text-white hover:opacity-95"
            >
              + Create Team
            </Button>
          </div>
        )}
      </div>

      {user?.role === "admin" && (
        <div className="flex gap-2">
          <Button
            variant={activeTab === "teams" ? "default" : "outline"}
            onClick={() => setActiveTab("teams")}
            className={
              activeTab === "teams"
                ? "bg-[#FF8A5B] text-white hover:opacity-95"
                : ""
            }
          >
            Teams
          </Button>
          <Button
            variant={activeTab === "members" ? "default" : "outline"}
            onClick={() => setActiveTab("members")}
            className={
              activeTab === "members"
                ? "bg-[#FF8A5B] text-white hover:opacity-95"
                : ""
            }
          >
            All Members
          </Button>
        </div>
      )}

      {/* Teams View */}
      {activeTab === "teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingTeams
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-100 p-4 bg-white space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-48" />
                  <div className="flex gap-8">
                    <Skeleton className="h-6 w-10" />
                    <Skeleton className="h-6 w-10" />
                    <Skeleton className="h-6 w-10" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            : teams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl border border-zinc-100 p-4 bg-white space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-zinc-900">
                        {team.name}
                      </h3>
                    </div>
                    <Badge className={statusColor(team.status)}>
                      {statusLabel(team.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">
                      {team.team_lead?.name}
                    </p>
                    <p className="text-xs text-zinc-500">Team Lead</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-zinc-900">
                        {team.members_count}
                      </p>
                      <p className="text-xs text-zinc-500">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-zinc-900">
                        {team.active_okrs_count}
                      </p>
                      <p className="text-xs text-zinc-500">Active OKRs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-zinc-900">
                        {team.average_progress}%
                      </p>
                      <p className="text-xs text-zinc-500">Avg Progress</p>
                    </div>
                  </div>

                  {/* Orange-themed progress bar (presentation only) */}
                  <div className="flex flex-col gap-2 text-sm">
                    <p className="text-sm text-zinc-700">Team Progress</p>
                    <div className="w-full rounded-full bg-[#FFE7DF] h-2 overflow-hidden">
                      <div
                        className="h-2 bg-[#FF8A5B] rounded-full"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, team.average_progress)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* Members View */}
      {activeTab === "members" && (
        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>OKRs</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingMembers
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24 mt-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                : members.map((m) => (
                    <TableRow key={m.id} className="hover:bg-zinc-50">
                      <TableCell className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#FF8A5B] text-white flex items-center justify-center text-sm font-semibold">
                          {m.member?.name?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900">
                            {m.member.name}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {m.member.title || ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-900">
                        {m.team || "_____"}
                      </TableCell>
                      <TableCell className="text-zinc-900">{m.okrs}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-36 rounded-full bg-[#FFE7DF] h-2 overflow-hidden">
                            <div
                              className="h-2 bg-[#FF8A5B] rounded-full"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, m.progress)
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">{m.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(m.status)}>
                          {statusLabel(m.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-500">
                        {m.last_active}
                      </TableCell>
                      <TableCell>
                        <button className="p-1 hover:bg-zinc-50 rounded">
                          ⋯
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}
      <CreateTeamFormModal open={open} setOpen={setOpen} />
    </div>
  );
}

export function CreateTeamFormModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("/api/teams", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: teamName }),
    });

    if (!res.ok) throw new Error("Failed to create team");

    setTeamName("");
    setOpen(false); // Close modal
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
          <DialogDescription>
            Enter the name of the team you want to create.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Engineering"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
