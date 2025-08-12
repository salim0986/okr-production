"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Target, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import { OKRsView } from "../okrs/okrs-view";

interface EmployeeInsights {
  activeOkrs: number;
  avgProgress: number;
  dueThisWeek: { count: number; nextTitle: string | null };
  comments: number;
}

interface KeyResult {
  id: string;
  title: string;
  progress: number;
  assignedToMe: boolean;
}

interface Objective {
  id: string;
  title: string;
  progress: number;
  status: string;
  keyResults: KeyResult[];
}

export function EmployeeDashboard() {
  const [insights, setInsights] = useState<EmployeeInsights | null>(null);
  const [okrs, setOkrs] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInModal, setCheckInModal] = useState<{
    open: boolean;
    krId: string | null;
  }>({ open: false, krId: null });
  const [checkInProgress, setCheckInProgress] = useState("");
  const [checkInComment, setCheckInComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resInsights = await fetch("/api/dashboard/employee", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const insightsData = await resInsights.json();
        console.log(insightsData);
        setInsights(insightsData);

        const resOkrs = await fetch("/api/objectives", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const okrData = await resOkrs.json();
        setOkrs(okrData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleCheckIn() {
    if (!checkInModal.krId) return;
    try {
      await fetch(`/api/key-results/${checkInModal.krId}/check-ins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: checkInComment,
          progress: Number(checkInProgress),
        }),
      });
      setCheckInModal({ open: false, krId: null });
      setCheckInProgress("");
      setCheckInComment("");
      // optionally refresh OKRs
    } catch (err) {
      console.error("Failed to create check-in", err);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      {insights && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active OKRs</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.activeOkrs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(insights.avgProgress * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Due This Week
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.dueThisWeek.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {insights.dueThisWeek.nextTitle || "-"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.comments}</div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* My OKRs */}
      <OKRsView />
      {/* Check In Modal
      <Dialog
        open={checkInModal.open}
        onOpenChange={(open) => setCheckInModal({ open, krId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            placeholder="Progress value"
            value={checkInProgress}
            onChange={(e) => setCheckInProgress(e.target.value)}
          />
          <Textarea
            placeholder="Comment"
            value={checkInComment}
            onChange={(e) => setCheckInComment(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleCheckIn}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
