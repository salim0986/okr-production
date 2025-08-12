"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { CreateObjectiveDialog } from "./create-objective-dialog";
import { EditObjectiveDialog } from "./edit-objective-dialog";
import ObjectiveCard from "@/components/okrs/objective-card";

interface Objective {
  id: string;
  title: string;
  description: string | null;
  progress: number;
  status: string;
  end_date?: string | null;
  team: {
    name: string;
    id: string;
  };
}

export function OKRsView() {
  const { user } = useAuth();
  const organizationId = user?.organization_id;
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [membersMap, setMembersMap] = useState<Record<string, string>>({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingObjectiveId, setEditingObjectiveId] = useState<string | null>(
    null
  );

  const fetchObjectives = useCallback(async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/objectives", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data: Objective[] = await res.json();
        setObjectives(data);
      } else {
        setObjectives([]);
      }
    } catch (err) {
      console.error("Failed to fetch objectives", err);
      setObjectives([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch org members to map created_by -> name
  useEffect(() => {
    if (!organizationId) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const fetchMembers = async () => {
      try {
        const res = await fetch(
          `/api/organizations/${organizationId}/members`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );
        if (!res.ok) return;
        const m = await res.json();
        const map: Record<string, string> = {};
        m.forEach((member: any) => {
          map[member.id] =
            member.member?.name ?? member.member?.email ?? member.id;
        });
        setMembersMap(map);
      } catch (err) {
        console.error("Failed to fetch org members", err);
      }
    };
    fetchMembers();
  }, [organizationId]);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "on track":
      case "on_track":
        return "default";
      case "at risk":
      case "at_risk":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Team OKRs</h2>
            <p className="text-muted-foreground">
              Track and manage objectives and key results
            </p>
          </div>
          {(user?.role === "admin" || user?.role === "team_lead") && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Objective
            </Button>
          )}
        </div>

        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team OKRs</h2>
          <p className="text-muted-foreground">
            Track and manage objectives and key results
          </p>
        </div>

        {(user?.role === "admin" || user?.role === "team_lead") && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Objective
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {objectives.length > 0 ? (
          objectives.map((objective) => (
            // Use ObjectiveCard to show each objective plus its key results (it will fetch KR if needed)
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              membersMap={membersMap}
              onUpdated={() => {
                // refresh parent objectives (so overall progress/status updates)
                fetchObjectives();
              }}
              setEditingObjectiveId={setEditingObjectiveId}
              setShowEditDialog={setShowEditDialog}
            >
              {/* keep compatibility: Edit button still controlled from parent */}
            </ObjectiveCard>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No objectives found</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by creating your first objective and key results.
              </p>
              {(user?.role === "admin" || user?.role === "team_lead") && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Objective
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <CreateObjectiveDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        organizationId={organizationId || ""}
        onObjectiveCreated={() => {
          fetchObjectives();
        }}
      />

      {editingObjectiveId && (
        <EditObjectiveDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) setEditingObjectiveId(null); // clear id when dialog closes
          }}
          objectiveId={editingObjectiveId}
          organizationId={organizationId || ""}
          onObjectiveUpdated={() => {
            fetchObjectives(); // refresh list after edit
            setShowEditDialog(false);
            setEditingObjectiveId(null);
          }}
        />
      )}
    </div>
  );
}
