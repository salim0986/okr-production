import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminDashboard() {
  const orgMetrics = [
    { title: "Total Teams", value: "12", change: "+2 this quarter", icon: Users },
    { title: "Active OKRs", value: "47", change: "+8 this month", icon: Target },
    { title: "Avg Completion", value: "73%", change: "+5% vs last quarter", icon: TrendingUp },
    { title: "At Risk OKRs", value: "8", change: "-2 from last week", icon: AlertTriangle }
  ];

  const teamPerformance = [
    { team: "Engineering", lead: "Sarah Chen", members: 8, completion: 85, status: "On Track" },
    { team: "Marketing", lead: "Mike Johnson", members: 5, completion: 92, status: "Ahead" },
    { team: "Sales", lead: "Emily Davis", members: 6, completion: 67, status: "At Risk" },
    { team: "Product", lead: "Alex Kim", members: 7, completion: 78, status: "On Track" },
    { team: "HR", lead: "Lisa Wang", members: 3, completion: 45, status: "Behind" }
  ];

  const inactiveUsers = [
    { name: "John Smith", lastActive: "8 days ago", team: "Engineering" },
    { name: "Maria Garcia", lastActive: "12 days ago", team: "Marketing" },
    { name: "David Wilson", lastActive: "15 days ago", team: "Sales" }
  ];

  return (
    <div className="space-y-6">
      {/* Organization Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {orgMetrics.map((metric, index) => (
          <Card key={index} className="neumorph-card neumorph-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Performance Table */}
        <div className="lg:col-span-2">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Team Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamPerformance.map((team, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{team.team}</TableCell>
                      <TableCell>{team.lead}</TableCell>
                      <TableCell>{team.members}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={team.completion} className="w-16 h-2" />
                          <span className="text-sm">{team.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            team.status === "Ahead" || team.status === "On Track" 
                              ? "default" 
                              : "destructive"
                          }
                          className={
                            team.status === "Ahead" ? "status-on-track" :
                            team.status === "On Track" ? "status-on-track" :
                            team.status === "At Risk" ? "status-at-risk" :
                            "status-blocked"
                          }
                        >
                          {team.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Critical Alerts */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    HR Team Behind Schedule
                  </p>
                  <p className="text-xs text-red-600">
                    Only 45% completion with 2 weeks remaining
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Sales Team At Risk
                  </p>
                  <p className="text-xs text-yellow-600">
                    3 key results flagged as blocked
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Marketing Ahead of Target
                  </p>
                  <p className="text-xs text-green-600">
                    92% completion, 3 weeks early
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inactive Users */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Inactive Users (7+ days)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inactiveUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.team}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                    <Button variant="ghost" size="sm">
                      Follow Up
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Create Team OKR
              </Button>
              <Button className="w-full" variant="outline">
                Send Reminder
              </Button>
              <Button className="w-full" variant="outline">
                Generate Report
              </Button>
              <Button className="w-full" variant="outline">
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}