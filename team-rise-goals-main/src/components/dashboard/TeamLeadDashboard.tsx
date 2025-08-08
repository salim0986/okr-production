import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  UserCheck
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TeamLeadDashboard() {
  const teamMetrics = [
    { title: "Team Members", value: "8", change: "+1 this month", icon: Users },
    { title: "Team OKRs", value: "6", change: "2 completed", icon: Target },
    { title: "Team Progress", value: "82%", change: "+8% this week", icon: TrendingUp },
    { title: "Pending Reviews", value: "3", change: "Need approval", icon: Clock }
  ];

  const teamMembers = [
    { 
      name: "Alice Johnson", 
      role: "Senior Developer", 
      okrs: 2, 
      completion: 85, 
      status: "On Track",
      lastUpdate: "2 hours ago"
    },
    { 
      name: "Bob Chen", 
      role: "UI Designer", 
      okrs: 1, 
      completion: 92, 
      status: "Ahead",
      lastUpdate: "1 day ago"
    },
    { 
      name: "Carol Smith", 
      role: "Product Manager", 
      okrs: 3, 
      completion: 67, 
      status: "At Risk",
      lastUpdate: "3 hours ago"
    },
    { 
      name: "David Wilson", 
      role: "Developer", 
      okrs: 2, 
      completion: 78, 
      status: "On Track",
      lastUpdate: "5 hours ago"
    },
    { 
      name: "Eva Martinez", 
      role: "QA Engineer", 
      okrs: 1, 
      completion: 45, 
      status: "Behind",
      lastUpdate: "1 day ago"
    }
  ];

  const pendingApprovals = [
    { 
      member: "Alice Johnson", 
      okr: "API Performance Optimization", 
      type: "Progress Update",
      progress: 85,
      submitted: "2 hours ago"
    },
    { 
      member: "Carol Smith", 
      okr: "User Research Initiative", 
      type: "Blocker Report",
      progress: 67,
      submitted: "4 hours ago"
    },
    { 
      member: "Bob Chen", 
      okr: "Design System v2", 
      type: "Completion",
      progress: 100,
      submitted: "1 day ago"
    }
  ];

  const recentActivities = [
    { member: "Alice Johnson", action: "Updated API performance metrics", time: "2 hours ago" },
    { member: "Bob Chen", action: "Completed design system documentation", time: "4 hours ago" },
    { member: "Carol Smith", action: "Added blocker to user research", time: "6 hours ago" },
    { member: "David Wilson", action: "Commented on team OKR", time: "8 hours ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Team Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {teamMetrics.map((metric, index) => (
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
        {/* Team Members Performance */}
        <div className="lg:col-span-2">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Team Members Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>OKRs</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </TableCell>
                      <TableCell>{member.okrs}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={member.completion} className="w-16 h-2" />
                          <span className="text-sm">{member.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            member.status === "Ahead" || member.status === "On Track" 
                              ? "default" 
                              : "destructive"
                          }
                          className={
                            member.status === "Ahead" ? "status-on-track" :
                            member.status === "On Track" ? "status-on-track" :
                            member.status === "At Risk" ? "status-at-risk" :
                            "status-blocked"
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.lastUpdate}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View OKRs</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Schedule 1:1</DropdownMenuItem>
                            <DropdownMenuItem>Assign OKR</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          {/* Pending Approvals */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingApprovals.map((approval, index) => (
                <div key={index} className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{approval.member}</p>
                      <p className="text-xs text-muted-foreground">{approval.okr}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {approval.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Progress value={approval.progress} className="w-16 h-1" />
                      <span className="text-xs">{approval.progress}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{approval.submitted}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-xs">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Request Changes
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Team Activity */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.member}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Team Actions */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle>Team Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Schedule Team Sync
              </Button>
              <Button className="w-full" variant="outline">
                Create Team OKR
              </Button>
              <Button className="w-full" variant="outline">
                Export Team Report
              </Button>
              <Button className="w-full" variant="outline">
                Send Team Update
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}