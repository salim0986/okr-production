"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  team: { id: string; name: string };
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

  // State for team filter
  const [selectedTeam, setSelectedTeam] = useState<string>("all");

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    type: "team" | "member";
    name?: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Memoized fetch functions
  const fetchTeams = useCallback(async () => {
    setLoadingTeams(true);
    try {
      const res = await fetch(
        `/api/teams/by-organization/${user?.organization_id}`
      );
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data: Team[] = await res.json();
      setTeams(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch teams!",
        variant: "destructive",
      });
    } finally {
      setLoadingTeams(false);
    }
  }, [user?.organization_id, toast]);

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const token = localStorage.getItem("token");
      let res;
      if (user?.role === "admin") {
        // Fetch all members for admin
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
        // Fetch only team members for non-admins
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
        return;
      }

      const data: Member[] = await res.json();
      setMembers(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch members!",
        variant: "destructive",
      });
    } finally {
      setLoadingMembers(false);
    }
  }, [user?.organization_id, user?.role, user?.team_id, toast]);

  // Use useEffect to call fetch functions
  useEffect(() => {
    if (!user?.organization_id) return;
    fetchTeams();
    console.log(members);
    console.log(selectedTeam);
  }, [user?.organization_id, open, fetchTeams, selectedTeam]);

  useEffect(() => {
    if (activeTab === "members" && user?.role === "admin") {
      fetchMembers();
    }
  }, [activeTab, fetchMembers, user?.role]);

  // Filter members based on selected team
  const filteredMembers =
    selectedTeam === "all"
      ? members
      : members.filter((member) => member.team?.id === selectedTeam);

  // Open confirmation for team or member delete
  function openConfirmDelete(
    id: string,
    type: "team" | "member",
    name?: string
  ) {
    setConfirmTarget({ id, type, name });
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    const token = localStorage.getItem("token");

    try {
      if (confirmTarget.type === "team") {
        const res = await fetch(`/api/teams/${confirmTarget.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to delete team");
        }

        setTeams((prev) => prev.filter((t) => t.id !== confirmTarget.id));
        toast({
          title: "Deleted",
          description: "Team deleted.",
          variant: "default",
        });
      } else {
        const res = await fetch(`/api/users/${confirmTarget.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to delete user");
        }

        setMembers((prev) => prev.filter((m) => m.id !== confirmTarget.id));
        toast({
          title: "Deleted",
          description: "Member removed.",
          variant: "default",
        });
      }

      setConfirmOpen(false);
      setConfirmTarget(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete. Try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  }

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
        <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-2 border-[#FF8A5B]">
          <Button
            variant={activeTab === "teams" ? "default" : "outline"}
            onClick={() => setActiveTab("teams")}
            className={cn(
              "px-4 py-3 rounded-full text-sm font-medium transition border border-2 border-[#FF8A5B]",
              activeTab === "teams"
                ? "bg-[#FF8A5B] text-white shadow-sm"
                : "bg-white text-zinc-700 border border-zinc-100 hover:bg-[#FFF2EF]"
            )}
          >
            Teams
          </Button>
          <Button
            variant={activeTab === "members" ? "default" : "outline"}
            onClick={() => setActiveTab("members")}
            className={cn(
              "px-4 py-3 rounded-full text-sm font-medium transition border border-2 border-[#FF8A5B]",
              activeTab === "members"
                ? "bg-[#FF8A5B] text-white shadow-sm"
                : "bg-white text-zinc-700 border border-zinc-100 hover:bg-[#FFF2EF]"
            )}
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

                    <div className="flex items-center gap-2">
                      <Badge className={statusColor(team.status)}>
                        {statusLabel(team.status)}
                      </Badge>

                      {/* Delete team button shown only to admins */}
                      {user?.role === "admin" && (
                        <button
                          aria-label={`Delete team ${team.name}`}
                          onClick={() =>
                            openConfirmDelete(team.id, "team", team.name)
                          }
                          className="p-1 rounded hover:bg-zinc-50"
                        >
                          <Trash size={16} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-zinc-900">
                      {team.team_lead?.name || "___"}
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
          {/* Team filter dropdown */}
          {user?.role === "admin" && (
            <div className="p-4 border-b border-zinc-100 flex items-center gap-2">
              <Label
                htmlFor="team-filter"
                className="text-sm font-medium text-zinc-700"
              >
                Filter by Team:
              </Label>
              <Select onValueChange={setSelectedTeam} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
              {loadingMembers ? (
                Array.from({ length: 5 }).map((_, i) => (
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
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((m) => (
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
                      {m.team?.name || "_____"}
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
                      {user?.role === "admin" && user.id != m.id && (
                        <button
                          aria-label={`Delete member ${m.member.name}`}
                          onClick={() =>
                            openConfirmDelete(m.id, "member", m.member.name)
                          }
                          className="p-1 hover:bg-zinc-50 rounded"
                        >
                          <Trash size={16} className="text-red-600" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-zinc-500 py-8"
                  >
                    No members found for this team.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateTeamFormModal open={open} setOpen={setOpen} />

      {/* Confirmation dialog used for both team and member deletions */}
      <Dialog
        open={confirmOpen}
        onOpenChange={(v) => {
          if (!v) {
            setConfirmOpen(false);
            setConfirmTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {confirmTarget?.type === "team"
                  ? `team "${confirmTarget?.name}"`
                  : `member "${confirmTarget?.name}"`}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setConfirmTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:opacity-95"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
    console.log(res);

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
