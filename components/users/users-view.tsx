"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  email: string;
  member: { name: string; title: string | null };
  team?: string;
  okrs: number;
  progress: number;
  status: "on_track" | "ahead" | "at_risk" | "behind" | string;
  last_active: string;
}

interface Team {
  id: string;
  name: string;
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

export function UsersView() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.organization_id) return;
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/organizations/${user.organization_id}/members`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: Member[] = await res.json();
        setMembers(data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to fetch users!",
          variant: "destructive",
        });
      }
      setLoading(false);
    };
    fetchMembers();
  }, [user?.organization_id, open]); // refresh after creating new user

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Organization Users</h2>
          <p className="text-gray-600">
            Manage all members of your organization
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>+ Create User</Button>
      </div>

      {/* User Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-2 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <Card key={m.id}>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{m.member.name}</CardTitle>
                <Badge className={statusColor(m.status)}>{m.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {m.email && (
                  <p className="text-sm text-gray-500">Email ID: {m.email}</p>
                )}
                {m.team && (
                  <p className="text-sm text-gray-500">Team: {m.team}</p>
                )}
                <p className="text-sm text-gray-500">
                  Last Active: {m.last_active}
                </p>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-semibold">{m.okrs}</span> OKRs
                  </div>
                  <div>{m.progress}% Progress</div>
                </div>
                <Progress value={m.progress} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateUserFormModal open={open} setOpen={setOpen} />
    </div>
  );
}

function CreateUserFormModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    role: "employee",
    email: "",
    password: "",
    team_id: "",
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // New state for success modal
  const [newUser, setNewUser] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!user?.organization_id) return;
    const fetchTeams = async () => {
      setLoadingTeams(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/organizations/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeams(data.teams || []);
      setLoadingTeams(false);
    };
    fetchTeams();
  }, [user?.organization_id]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    const payload = { ...formData };

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create user");
    const createdUser = await res.json();

    // Store created user info & show modal
    setNewUser({
      ...createdUser,
      password: formData.password,
      team_name: createdUser.team.name,
    });
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      name: "",
      role: "employee",
      email: "",
      password: "",
      team_id: "",
    });
    setSubmitting(false);
    setOpen(false);
  };

  const copyToClipboard = () => {
    if (newUser) {
      const text = `
      Here is the credential for new user:

      Name: ${newUser.name}
      Email: ${newUser.email}
      Password: ${newUser.password}
      Role: ${newUser.role}
      Team: ${newUser.team_name || "N/A"}
            `.trim();
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <>
      {/* Create User Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New User</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new member to your organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => handleChange("role", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_lead">Team Lead</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Team</Label>
              <Select
                value={formData.team_id}
                onValueChange={(val) => handleChange("team_id", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTeams ? (
                    <SelectItem value="" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {formData.role === "team_lead" && (
              <p className="text-xs text-gray-700 m-2">
                Note: Existing team leader will be demoted.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setFormData({
                    name: "",
                    role: "employee",
                    email: "",
                    password: "",
                    team_id: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Created Successfully</DialogTitle>
            <DialogDescription>
              Here are the details of the new user:
            </DialogDescription>
          </DialogHeader>
          {newUser && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {newUser.name}
              </p>
              <p>
                <strong>Email:</strong> {newUser.email}
              </p>
              <p>
                <strong>Password:</strong> {newUser.password}
              </p>
              <p>
                <strong>Role:</strong> {newUser.role}
              </p>
              {newUser.team_name && (
                <p>
                  <strong>Team:</strong> {newUser.team_name}
                </p>
              )}
            </div>
          )}
          <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
