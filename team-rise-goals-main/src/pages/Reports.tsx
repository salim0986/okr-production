import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  MessageSquare,
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const Reports = () => {
  const { userRole } = useUserStore();
  
  const isHistoryPage = location.pathname === "/history";
  const pageTitle = isHistoryPage ? "History" : "Reports";
  const pageDescription = isHistoryPage 
    ? "View your OKR activity history and updates"
    : "Analytics and insights for OKR performance";

  // Mock data for charts (in a real app, this would come from an API)
  const chartData = {
    objective_progress: [
      { month: "Jan", completion: 45 },
      { month: "Feb", completion: 58 },
      { month: "Mar", completion: 73 },
      { month: "Apr", completion: 82 },
      { month: "May", completion: 89 },
      { month: "Jun", completion: 94 }
    ],
    team_performance: [
      { team: "Engineering", completion: 85 },
      { team: "Marketing", completion: 92 },
      { team: "Sales", completion: 67 },
      { team: "Product", completion: 78 },
      { team: "HR", completion: 45 }
    ],
    status_breakdown: [
      { status: "On Track", count: 24, percentage: 60 },
      { status: "At Risk", count: 10, percentage: 25 },
      { status: "Blocked", count: 6, percentage: 15 }
    ]
  };

  const activityHistory = [
    {
      id: 1,
      type: "progress_update",
      user: "Alice Johnson",
      userAvatar: "/placeholder.svg",
      action: "Updated progress on API Performance Optimization",
      okr: "Improve Development Velocity",
      details: "Increased completion from 70% to 85%",
      timestamp: "2024-03-08 14:30",
      status: "On Track"
    },
    {
      id: 2,
      type: "comment",
      user: "Sarah Chen",
      userAvatar: "/placeholder.svg",
      action: "Added comment to User Engagement OKR",
      okr: "Increase User Engagement",
      details: "Great progress on the new features! The user feedback has been very positive.",
      timestamp: "2024-03-08 11:15",
      status: "On Track"
    },
    {
      id: 3,
      type: "blocker",
      user: "Carol Smith",
      userAvatar: "/placeholder.svg",
      action: "Reported blocker on User Research Initiative",
      okr: "Product Strategy",
      details: "Waiting for legal approval for user interview consent forms",
      timestamp: "2024-03-08 09:45",
      status: "Blocked"
    },
    {
      id: 4,
      type: "completion",
      user: "Bob Chen",
      userAvatar: "/placeholder.svg",
      action: "Completed Design System v2",
      okr: "Improve Development Velocity",
      details: "All components documented and implemented",
      timestamp: "2024-03-07 16:20",
      status: "Completed"
    },
    {
      id: 5,
      type: "created",
      user: "Mike Johnson",
      userAvatar: "/placeholder.svg",
      action: "Created new objective: Q2 Marketing Campaign",
      okr: "Q2 Marketing Campaign",
      details: "Objective includes 4 key results focused on lead generation",
      timestamp: "2024-03-07 10:00",
      status: "On Track"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "progress_update":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "blocker":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "completion":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "created":
        return <Target className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const className = 
      status === "Completed" || status === "On Track" ? "status-on-track" :
      status === "At Risk" ? "status-at-risk" :
      "status-blocked";
    
    return <Badge variant="outline" className={className}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
        
        {!isHistoryPage && (
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        )}
      </div>

      <Tabs defaultValue={isHistoryPage ? "history" : "reports"} className="space-y-6">
        <TabsList>
          {!isHistoryPage && <TabsTrigger value="reports">Reports</TabsTrigger>}
          <TabsTrigger value="history">Activity History</TabsTrigger>
          {!isHistoryPage && userRole === "Admin" && <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>}
        </TabsList>

        {!isHistoryPage && (
          <TabsContent value="reports" className="space-y-6">
            {/* Chart Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Objective Progress Chart */}
              <Card className="neumorph-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Objective Progress Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Simple chart representation */}
                    <div className="space-y-2">
                      {chartData.objective_progress.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm w-12">{data.month}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${data.completion}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm w-12 text-right">{data.completion}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Overall progress has increased by 49% over the last 6 months
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Team Performance Chart */}
              <Card className="neumorph-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {chartData.team_performance.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm w-20">{data.team}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-muted rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all ${
                                  data.completion >= 80 ? 'bg-green-500' :
                                  data.completion >= 60 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${data.completion}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm w-12 text-right">{data.completion}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Breakdown */}
            <Card className="neumorph-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  OKR Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {chartData.status_breakdown.map((data, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="text-3xl font-bold">{data.count}</div>
                      <div className="text-sm text-muted-foreground">{data.status}</div>
                      <div className="text-xs text-muted-foreground">{data.percentage}% of total</div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            data.status === "On Track" ? 'bg-green-500' :
                            data.status === "At Risk" ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="history" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activityHistory.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={activity.userAvatar} alt={activity.user} />
                              <AvatarFallback className="text-xs">
                                {activity.user.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{activity.user}</span>
                            <span className="text-sm text-muted-foreground">
                              {activity.action}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-primary">{activity.okr}</p>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                        </div>
                        <div className="text-right space-y-1">
                          {getStatusBadge(activity.status)}
                          <div className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-4">
                <Button variant="outline">Load More Activity</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {!isHistoryPage && userRole === "Admin" && (
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="neumorph-card">
                <CardHeader>
                  <CardTitle>Advanced Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Time to Complete OKR</span>
                    <span className="font-medium">8.5 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">OKR Success Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Contributors</span>
                    <span className="font-medium">32/35</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Blocked OKRs</span>
                    <span className="font-medium text-red-600">6</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="neumorph-card">
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Active Users</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Comments This Week</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Updates This Week</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Update Frequency</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Reports;