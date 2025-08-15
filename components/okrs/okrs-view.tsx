"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { CreateObjectiveDialog } from "./create-objective-dialog";
import { EditObjectiveDialog } from "./edit-objective-dialog";
import ObjectiveCard from "@/components/okrs/objective-card";
import { cn } from "@/lib/utils"; // helper for conditional classes
import { RealtimePostgresPayload, supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // filter state
  const [filter, setFilter] = useState<"active" | "completed">("active");

  // small local search state (UI-only — does not change logic)
  const [search, setSearch] = useState("");

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
      toast({
        title: "Error",
        description: "Failed to fetch objectives!",
        variant: "destructive",
      });
      console.error("Failed to fetch objectives", err);
      setObjectives([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // fetch org members
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

  // filtered objectives based on current filter
  const filteredObjectives = objectives.filter((obj) =>
    filter === "active"
      ? obj.status?.toLowerCase() !== "completed"
      : obj.status?.toLowerCase() === "completed"
  );

  // Realtime subscription (same logic as your original)
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const channel = supabase
      .channel("realtime:objectives")
      .on<RealtimePostgresPayload<any>>(
        "postgres_changes",
        { event: "*", schema: "public", table: "objectives" },
        async (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`/api/objectives/${payload.new.id}`, {
                headers: token
                  ? { Authorization: `Bearer ${token}` }
                  : undefined,
              });
              if (res.ok) {
                const freshObjective: Objective = await res.json();
                setObjectives((prev) => {
                  if (payload.eventType === "INSERT") {
                    return [...prev, freshObjective];
                  }
                  if (payload.eventType === "UPDATE") {
                    return prev.map((obj) =>
                      obj.id === freshObjective.id ? freshObjective : obj
                    );
                  }
                  return prev;
                });
              }
            } catch (e) {
              console.error("Failed to refetch objective from API", e);
            }
          }

          if (payload.eventType === "DELETE") {
            setObjectives((prev) =>
              prev.filter((obj) => obj.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ---------- UI ----------

  if (loading) {
    return (
      <div className="space-y-6">
        {/* header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-56 bg-zinc-200 rounded-md animate-pulse" />
            <div className="h-4 w-40 bg-zinc-200 rounded-md animate-pulse" />
          </div>
          <div className="h-10 w-36 rounded-full bg-[#FF8A5B] opacity-70 animate-pulse" />
        </div>

        {/* filters skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-36 bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-8 w-28 bg-zinc-100 rounded-full animate-pulse" />
        </div>

        {/* fake loading cards */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl bg-[#FBEAE4] border border-zinc-100 shadow-sm"
            >
              <CardContent>
                <div className="h-6 bg-zinc-200 rounded w-3/4 animate-pulse mb-3" />
                <div className="h-3 bg-zinc-200 rounded w-1/2 animate-pulse mb-3" />
                <div className="h-4 bg-zinc-200 rounded w-full animate-pulse" />
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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Team OKRs
          </h2>
          <p className="text-sm text-zinc-500">
            Track and manage objectives and key results
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* lightweight search UI — purely presentational */}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-zinc-100 rounded-full px-3 py-2 w-[420px] shadow-sm">
            <svg
              className="h-4 w-4 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M21 21l-4.35-4.35"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="11" cy="11" r="6" strokeWidth="1.5" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search objectives..."
              className="flex-1 bg-transparent outline-none text-sm text-zinc-700"
            />
          </div>

          {(user?.role === "admin" || user?.role === "team_lead") && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#FF8A5B] hover:opacity-95 text-white rounded-full px-4 py-2 shadow-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Objective
            </Button>
          )}
        </div>
      </div>

      {/* filter tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFilter("active")}
          className={cn(
            "px-4 py-3 rounded-full text-sm font-medium transition",
            filter === "active"
              ? "bg-[#FF8A5B] text-white shadow-sm"
              : "bg-white text-zinc-700 border border-zinc-100 hover:bg-[#FFF2EF]"
          )}
        >
          Active Objectives
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={cn(
            "px-4 py-3 rounded-full text-sm font-medium transition",
            filter === "completed"
              ? "bg-[#FF8A5B] text-white shadow-sm"
              : "bg-white text-zinc-700 border border-zinc-100 hover:bg-[#FFF2EF]"
          )}
        >
          Completed
        </button>
      </div>

      {/* objectives list */}
      <div className="space-y-4">
        {filteredObjectives.length > 0 ? (
          // keep ObjectiveCard usage and its props intact — it will render the objective UI
          filteredObjectives
            // if user typed search filter client-side visually (non destructive)
            .filter((o) =>
              search.trim()
                ? (o.title ?? "")
                    .toLowerCase()
                    .includes(search.trim().toLowerCase())
                : true
            )
            .map((objective) => (
              <div
                key={objective.id}
                className="rounded-2xl bg-white border border-zinc-100 shadow-sm"
              >
                {/* We keep ObjectiveCard component usage (logic unchanged) */}
                <ObjectiveCard
                  objective={objective}
                  membersMap={membersMap}
                  onUpdated={fetchObjectives}
                  setEditingObjectiveId={setEditingObjectiveId}
                  setShowEditDialog={setShowEditDialog}
                />
              </div>
            ))
        ) : (
          <Card className="rounded-2xl bg-white border border-zinc-100 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-[#FF8A5B] mb-4" />
              <h3 className="text-lg font-medium mb-2 text-zinc-900">
                No objectives found
              </h3>
              <p className="text-sm text-zinc-500 text-center mb-4">
                {filter === "active"
                  ? "Get started by creating your first active objective."
                  : "No completed objectives yet."}
              </p>
              {(user?.role === "admin" || user?.role === "team_lead") && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-[#FF8A5B] hover:opacity-95 text-white rounded-full px-4 py-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Objective
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* dialogs */}
      <CreateObjectiveDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        organizationId={organizationId || ""}
        onObjectiveCreated={fetchObjectives}
      />
      {editingObjectiveId && (
        <EditObjectiveDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) setEditingObjectiveId(null);
          }}
          objectiveId={editingObjectiveId}
          organizationId={organizationId || ""}
          onObjectiveUpdated={() => {
            fetchObjectives();
            setShowEditDialog(false);
            setEditingObjectiveId(null);
          }}
        />
      )}
    </div>
  );
}
