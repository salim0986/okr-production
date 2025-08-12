"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "on_track":
    case "on track":
      return "bg-green-100 text-green-800";
    case "ahead":
      return "bg-emerald-100 text-emerald-800";
    case "at_risk":
    case "at risk":
      return "bg-yellow-100 text-yellow-800";
    case "behind":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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
  const [activeTab, setActiveTab] = useState<"teams" | "members">("teams");
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (!user?.organization_id) return;

    const fetchTeams = async () => {
      setLoadingTeams(true);
      const res = await fetch(
        `/api/teams/by-organization/${user?.organization_id}`
      );
      const data: Team[] = await res.json();
      setTeams(data);
      setLoadingTeams(false);
    };

    fetchTeams();
  }, [user?.organization_id, open]);

  useEffect(() => {
    if (activeTab !== "members" || !teams.length) return;

    const fetchMembers = async () => {
      setLoadingMembers(true);
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
      const data: Member[] = await res.json();
      console.log(data);
      setMembers(data);
      setLoadingMembers(false);
    };

    fetchMembers();
  }, [activeTab, teams]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold">Teams & People</h2>
          <p>Manage teams and track members performance</p>
        </div>
        <div>
          <Button variant="default" onClick={() => setOpen(true)}>
            + Create Team
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant={activeTab === "teams" ? "default" : "outline"}
          onClick={() => setActiveTab("teams")}
        >
          Teams
        </Button>
        {
          <Button
            variant={activeTab === "members" ? "default" : "outline"}
            onClick={() => setActiveTab("members")}
          >
            All Members
          </Button>
        }
      </div>

      {/* Teams View */}
      {activeTab === "teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingTeams
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-4 bg-white space-y-3"
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
                  className="rounded-lg border p-4 bg-white space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{team.name}</h3>
                    </div>
                    <Badge className={statusColor(team.status)}>
                      {team.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{team.team_lead?.name}</p>
                    <p className="text-xs text-gray-500">Team Lead</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {team.members_count}
                      </p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {team.active_okrs_count}
                      </p>
                      <p className="text-xs text-gray-500">Active OKRs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">
                        {team.average_progress}%
                      </p>
                      <p className="text-xs text-gray-500">Avg Progress</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <p>Team Progress</p>
                    <Progress value={team.average_progress} />
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* Members View */}
      {activeTab === "members" && (
        <div className="rounded-lg border bg-white">
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
                    <TableRow key={m.id}>
                      <TableCell className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div>
                          <div className="font-medium">{m.member.name}</div>
                          <div className="text-sm text-gray-500">
                            {m.member.title || ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{m.team}</TableCell>
                      <TableCell>{m.okrs}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={m.progress} className="w-20" />
                          <span className="text-sm">{m.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(m.status)}>
                          {statusLabel(m.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{m.last_active}</TableCell>
                      <TableCell>
                        <button className="p-1 hover:bg-gray-100 rounded">
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
