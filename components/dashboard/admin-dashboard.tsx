"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Target, TrendingUp, Building2, Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface QuickStats {
  totalTeams: number;
  activeOkrs: number;
  avgCompletion: number;
  atRiskOkrs: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

interface TableStats {
  team: string;
  lead: string;
  members: number;
  completion: number;
  status: string;
}

interface InactiveUser {
  id: string;
  name: string;
  last_login: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [tableData, setTableData] = useState<TableStats[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<InactiveUser[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardQuickData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `/api/dashboard/admin/${user?.organization_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardQuickData();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/teams/admin/insights`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTableData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  useEffect(() => {
    const fetchInactiveUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/users/inactive`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInactiveUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your organization's OKR performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTeams || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active teams in organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Objectives
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeOkrs || 0}</div>
            <p className="text-xs text-muted-foreground">Across all teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avgCompletion || 0}%
            </div>
            <Progress value={stats?.avgCompletion || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.atRiskOkrs || 0}</div>
            <p className="text-xs text-muted-foreground">Objectives Behind</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teams Summary</CardTitle>
            <CardDescription>
              Latest updates across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tableData?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, idx) => {
                    const statusVariantMap: Record<
                      string,
                      "default" | "secondary" | "destructive" | "outline"
                    > = {
                      ahead: "default",
                      on_track: "secondary",
                      at_risk: "destructive",
                      completed: "outline",
                      overdue: "destructive",
                    };

                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge variant="outline">{row.team}</Badge>
                        </TableCell>
                        <TableCell>{row.lead}</TableCell>
                        <TableCell>{row.members}</TableCell>
                        <TableCell>
                          <div className="w-[100px]">
                            <Progress value={row.completion} />
                            <span className="text-xs text-muted-foreground">
                              {row.completion}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusVariantMap[row.status] || "outline"}
                          >
                            {row.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No team found</p>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2 ">
            <Clock className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg font-semibold">
              Inactive Users (7+ days)
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y divide-gray-100">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <div className="font-medium">{user.name}</div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-500">
                    {user.last_login.substring(0, 10)}
                  </span>
                  <button className="text-sm font-medium text-indigo-600 hover:underline">
                    Follow Up
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
