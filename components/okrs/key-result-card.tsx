"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import UpdateProgressModal, { KRForModal } from "./update-progress-modal";
import { useAuth } from "@/contexts/auth-context";

type KR = {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  assigned_to?: string | null;
  units?: string | null;
  status?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
};

type Objective = {
  id: string;
  title: string;
  description?: string | null;
  progress: number;
  status: string;
  end_date?: string | null;
  created_by?: string | null;
  keyResults?: KR[]; // optional preloaded
};

type Props = {
  objective: Objective;
  membersMap?: Record<string, string>;
  onUpdated?: () => void;
  setEditingObjectiveId: Dispatch<SetStateAction<string | null>>;
  setShowEditDialog: Dispatch<SetStateAction<boolean>>;
  currentUserId?: string; // optional, wont break previous usage
  role?: string; // optional, use to detect 'employee'
};

export default function ObjectiveCard({
  objective,
  membersMap = {},
  onUpdated,
  setEditingObjectiveId,
  setShowEditDialog,
  currentUserId: propCurrentUserId,
  role: propRole,
}: Props) {
  // fallback to auth context if parent didn't pass currentUserId / role
  const { user } = useAuth();
  const currentUserId = propCurrentUserId ?? user?.id ?? "";
  const currentRole = propRole ?? user?.role ?? "";

  const isEmployee = currentRole?.toLowerCase() === "employee";

  const [expanded, setExpanded] = useState<boolean>(false);
  const [krs, setKrs] = useState<KR[]>(objective.keyResults ?? []);
  const [loadingKRs, setLoadingKRs] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [commentOpenId, setCommentOpenId] = useState<string | null>(null);

  // modals
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [activeKR, setActiveKR] = useState<KRForModal | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // fetch KRs (used on mount or lazy on expand)
  const fetchKRs = useCallback(async () => {
    setLoadingKRs(true);
    try {
      const res = await fetch(`/api/objectives/${objective.id}/key-results`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data: KR[] = await res.json();
        setKrs(data);
      } else {
        setKrs([]);
      }
    } catch (err) {
      console.error("Failed to fetch key results", err);
      setKrs([]);
    } finally {
      setLoadingKRs(false);
    }
  }, [objective.id, token]);

  // initial fetch if objective didn't include KRs
  useEffect(() => {
    if (objective.keyResults && objective.keyResults.length) return;
    fetchKRs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objective.id]);

  // lazy load on expand if not loaded
  useEffect(() => {
    if (!expanded) return;
    if (krs.length > 0) return;
    fetchKRs();
  }, [expanded, krs.length, fetchKRs]);

  const krPercent = (kr: KR) => {
    const t = Number(kr.target_value || 0);
    const c = Number(kr.current_value || 0);
    return t > 0 ? Math.round((c / t) * 100) : 0;
  };

  // comment
  const postComment = async (krId: string) => {
    const text = (commentText[krId] || "").trim();
    if (!text) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/key-results/${krId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      setCommentText((s) => ({ ...s, [krId]: "" }));
      onUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
      setCommentOpenId(null);
    }
  };

  // update progress via existing modal (team-lead/admin)
  const handleKRUpdate = async (newValue: number) => {
    if (!activeKR) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/key-results/${activeKR.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ current_value: newValue }),
      });
      if (!res.ok) throw new Error("Failed to update key result");
      // update local krs
      setKrs((prev) =>
        prev.map((x) =>
          x.id === activeKR.id ? { ...x, current_value: newValue } : x
        )
      );
      onUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  // create a check-in (employee flow)
  const createCheckIn = async (
    krId: string,
    value: number,
    comment?: string
  ) => {
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/key-results/${krId}/check-ins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // your API sample expects { comment, progress } as body
        body: JSON.stringify({ comment: comment ?? null, progress: value }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create check-in");
      }
      // Optionally refresh KRs or parent objective list
      await fetchKRs();
      onUpdated?.();
    } catch (err) {
      console.error("Check-in failed:", err);
      throw err;
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <Card className="rounded-lg">
        <CardHeader className="flex items-start justify-between">
          <div className="max-w-[70%]">
            <CardTitle>{objective.title}</CardTitle>
            {objective.description && (
              <CardDescription>{objective.description}</CardDescription>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div>
                Due:{" "}
                {objective.end_date
                  ? new Date(objective.end_date).toLocaleDateString()
                  : "—"}
              </div>
              <div>
                Owner:{" "}
                {objective.created_by
                  ? membersMap[objective.created_by] ?? objective.created_by
                  : "—"}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <Badge>{objective.status}</Badge>
            <div className="text-2xl font-semibold pt-3">
              {objective.progress}%
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{objective.progress}%</span>
            </div>
            <Progress
              value={Math.max(0, Math.min(100, objective.progress))}
              className="h-3"
            />
          </div>

          {/* Key Results */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">
                Key Results ({krs.length})
              </h4>
              <button
                className="text-sm text-gray-500 flex items-center gap-1"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls={`krs-${objective.id}`}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Expand
                  </>
                )}
              </button>
            </div>

            {expanded && (
              <div id={`krs-${objective.id}`} className="space-y-4">
                {loadingKRs ? (
                  <div className="text-sm text-muted-foreground">
                    Loading key results...
                  </div>
                ) : krs.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No key results found
                  </div>
                ) : (
                  krs.map((kr) => {
                    const isMine = !!(
                      kr.assigned_to && kr.assigned_to === currentUserId
                    );
                    // highlight style for assigned KRs
                    const highlightClass = isMine
                      ? "bg-blue-50 shadow-md border-blue-200"
                      : "bg-gray-50";
                    return (
                      <div
                        key={kr.id}
                        className={`p-3 rounded-lg space-y-3 border ${highlightClass}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="max-w-[75%]">
                            <div className="font-medium">{kr.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {kr.current_value} / {kr.target_value}{" "}
                              {kr.units ?? ""}
                            </div>

                            <div className="mt-2 mb-2 text-sm">Progress</div>
                            <div className="flex items-center gap-3">
                              <Progress
                                value={Math.max(
                                  0,
                                  Math.min(100, krPercent(kr))
                                )}
                                className="h-2 flex-1"
                              />
                              <div className="text-sm">{krPercent(kr)}%</div>
                            </div>

                            {kr.description ? (
                              <div className="mt-3 p-3 bg-white rounded text-sm text-gray-700">
                                {kr.description}
                              </div>
                            ) : null}
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <Badge className="bg-emerald-100 text-emerald-800">
                              {kr.status ?? "On Track"}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Assigned:{" "}
                              {kr.assigned_to
                                ? membersMap[kr.assigned_to] ?? kr.assigned_to
                                : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {/* If user is employee and this KR is assigned to them -> Check In flow */}
                          {isEmployee && isMine ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveKR({
                                  id: kr.id,
                                  title: kr.title,
                                  current_value: kr.current_value,
                                  target_value: kr.target_value,
                                  units: kr.units,
                                });
                                setCheckInModalOpen(true);
                              }}
                              disabled={loadingAction}
                            >
                              Check In
                            </Button>
                          ) : (
                            !isEmployee && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActiveKR({
                                    id: kr.id,
                                    title: kr.title,
                                    current_value: kr.current_value,
                                    target_value: kr.target_value,
                                    units: kr.units,
                                  });
                                  setUpdateModalOpen(true);
                                }}
                                disabled={loadingAction}
                              >
                                Update Progress
                              </Button>
                            )
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // toggle specific kr comment input
                              setCommentOpenId((prev) =>
                                prev === kr.id ? null : kr.id
                              );
                              // focus textarea after a tick
                              setTimeout(() => {
                                document
                                  .getElementById(`kr-comment-${kr.id}`)
                                  ?.focus();
                              }, 50);
                            }}
                          >
                            Comment
                          </Button>
                        </div>

                        {commentOpenId === kr.id && (
                          <div className="pt-2">
                            <Textarea
                              id={`kr-comment-${kr.id}`}
                              value={commentText[kr.id] ?? ""}
                              onChange={(e) =>
                                setCommentText((s) => ({
                                  ...s,
                                  [kr.id]: e.target.value,
                                }))
                              }
                              placeholder="Add a comment..."
                              rows={2}
                            />
                            <div className="flex justify-end pt-2">
                              <Button
                                size="sm"
                                onClick={() => postComment(kr.id)}
                                disabled={loadingAction || !commentText[kr.id]}
                              >
                                {loadingAction ? "Posting..." : "Post Comment"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* only show edit objective action for non-employees */}
          {!isEmployee && (
            <>
              <div className="pt-3 border-t" />
              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingObjectiveId(objective.id);
                    setShowEditDialog(true);
                  }}
                >
                  Edit Objective
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Update Progress Modal (existing) */}
      <UpdateProgressModal
        open={updateModalOpen}
        onOpenChange={(v) => {
          setUpdateModalOpen(v);
          if (!v) setActiveKR(null);
        }}
        kr={activeKR}
        onSubmit={async (newValue: number) => {
          await handleKRUpdate(newValue);
        }}
      />

      {/* Check-In Modal (employee) */}
      <CheckInModal
        open={checkInModalOpen}
        onOpenChange={(v) => {
          setCheckInModalOpen(v);
          if (!v) setActiveKR(null);
        }}
        kr={activeKR}
        onSubmit={async (value: number, comment?: string) => {
          if (!activeKR) return;
          await createCheckIn(activeKR.id, value, comment);
          setCheckInModalOpen(false);
          setActiveKR(null);
        }}
        busy={loadingAction}
      />
    </>
  );
}

/* ------------------------------
   Inline CheckInModal component
   ------------------------------
   Minimal, self-contained modal so you don't need extra imports.
   Uses Tailwind; feel free to replace with your dialog component.
*/
function CheckInModal({
  open,
  onOpenChange,
  kr,
  onSubmit,
  busy = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kr: KRForModal | null;
  onSubmit: (value: number, comment?: string) => Promise<void>;
  busy?: boolean;
}) {
  const [value, setValue] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // reset when opening
  useEffect(() => {
    if (open && kr) {
      setValue(Number(kr.current_value ?? 0));
      setComment("");
    }
  }, [open, kr]);

  if (!open || !kr) return null;

  return (
    // overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div className="relative z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Check In — {kr.title}</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-muted-foreground block">
            Progress value
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />

          <label className="text-sm text-muted-foreground block">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => onOpenChange(false)}
            type="button"
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={async () => {
              try {
                await onSubmit(value, comment);
              } catch (err) {
                // swallow - parent will console error
              }
            }}
            disabled={busy || Number.isNaN(value) || value < 0 || value > 100}
            type="button"
          >
            {busy ? "Saving..." : "Submit Check-in"}
          </button>
        </div>
      </div>
    </div>
  );
}
