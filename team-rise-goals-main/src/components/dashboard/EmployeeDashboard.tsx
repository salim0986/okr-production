import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Calendar, MessageSquare, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export function EmployeeDashboard() {
  const myOKRs = [
    {
      id: 1,
      title: "Increase User Engagement",
      progress: 75,
      status: "On Track",
      dueDate: "2024-03-31",
      keyResults: [
        { title: "Implement 3 new features", current: 2, target: 3, progress: 67 },
        { title: "Reduce page load time by 20%", current: 15, target: 20, progress: 75 },
        { title: "Increase user retention to 85%", current: 80, target: 85, progress: 94 }
      ]
    },
    {
      id: 2,
      title: "Improve Code Quality",
      progress: 60,
      status: "At Risk",
      dueDate: "2024-03-15",
      keyResults: [
        { title: "Code coverage above 90%", current: 82, target: 90, progress: 91 },
        { title: "Zero critical bugs", current: 2, target: 0, progress: 80 },
        { title: "Complete security audit", current: 0, target: 1, progress: 0 }
      ]
    }
  ];

  const upcomingDeadlines = [
    { title: "Security audit completion", date: "2024-03-15", type: "Key Result" },
    { title: "Q1 OKR Review", date: "2024-03-31", type: "Objective" },
    { title: "Feature release", date: "2024-03-20", type: "Key Result" }
  ];

  const recentUpdates = [
    { title: "Sarah commented on User Engagement OKR", time: "2 hours ago", type: "comment" },
    { title: "Page load time improved to 3.2s", time: "1 day ago", type: "progress" },
    { title: "New blocker added to Code Quality OKR", time: "2 days ago", type: "blocker" }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active OKRs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+1 from last quarter</p>
          </CardContent>
        </Card>

        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Security audit</p>
          </CardContent>
        </Card>

        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">New responses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* My OKRs */}
        <div className="lg:col-span-2">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                My OKRs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {myOKRs.map((okr) => (
                <div key={okr.id} className="space-y-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{okr.title}</h3>
                      <p className="text-sm text-muted-foreground">Due: {okr.dueDate}</p>
                    </div>
                    <Badge 
                      variant={okr.status === "On Track" ? "default" : "destructive"}
                      className={okr.status === "On Track" ? "status-on-track" : "status-at-risk"}
                    >
                      {okr.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{okr.progress}%</span>
                    </div>
                    <Progress value={okr.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Results:</h4>
                    {okr.keyResults.map((kr, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex-1">{kr.title}</span>
                          <span className="text-muted-foreground">
                            {kr.current}/{kr.target}
                          </span>
                        </div>
                        <Progress value={kr.progress} className="h-1" />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Update Progress</Button>
                    <Button size="sm" variant="ghost">Add Comment</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{deadline.date}</p>
                    {index === 0 && (
                      <AlertCircle className="h-4 w-4 text-warning ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentUpdates.map((update, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {update.type === "comment" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                    {update.type === "progress" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {update.type === "blocker" && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{update.title}</p>
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full">
                View All Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}