import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Target, Calendar, MessageSquare, AlertTriangle } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const OKRs = () => {
  const { userRole } = useUserStore();
  const [isNewOKROpen, setIsNewOKROpen] = useState(false);

  const activeOKRs = [
    {
      id: 1,
      title: "Increase User Engagement",
      description: "Drive user adoption and engagement across our platform",
      progress: 75,
      status: "On Track",
      dueDate: "2024-03-31",
      owner: "John Doe",
      keyResults: [
        {
          id: 1,
          title: "Implement 3 new user-facing features",
          target: 3,
          current: 2,
          progress: 67,
          status: "On Track",
          lastUpdate: "Completed feature A and B, starting feature C next week"
        },
        {
          id: 2,
          title: "Reduce page load time by 20%",
          target: 20,
          current: 15,
          progress: 75,
          status: "On Track",
          lastUpdate: "Optimized images and implemented lazy loading"
        },
        {
          id: 3,
          title: "Increase user retention to 85%",
          target: 85,
          current: 80,
          progress: 94,
          status: "Ahead",
          lastUpdate: "Added onboarding tutorial, seeing good results"
        }
      ]
    },
    {
      id: 2,
      title: "Improve Development Velocity",
      description: "Streamline development processes and reduce technical debt",
      progress: 60,
      status: "At Risk",
      dueDate: "2024-03-15",
      owner: "Sarah Chen",
      keyResults: [
        {
          id: 4,
          title: "Achieve 90% code coverage",
          target: 90,
          current: 82,
          progress: 91,
          status: "On Track",
          lastUpdate: "Added unit tests for auth module"
        },
        {
          id: 5,
          title: "Reduce deployment time to under 5 minutes",
          target: 5,
          current: 8,
          progress: 60,
          status: "At Risk",
          lastUpdate: "Pipeline optimization in progress, facing some blockers"
        },
        {
          id: 6,
          title: "Complete security audit",
          target: 1,
          current: 0,
          progress: 0,
          status: "Blocked",
          lastUpdate: "Waiting for external security firm availability"
        }
      ]
    }
  ];

  const completedOKRs = [
    {
      id: 3,
      title: "Launch Marketing Campaign",
      description: "Successfully launch Q4 marketing initiative",
      progress: 100,
      status: "Completed",
      dueDate: "2024-01-31",
      owner: "Mike Johnson",
      completedDate: "2024-01-28"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === "Employee" ? "My OKRs" : "Team OKRs"}
          </h1>
          <p className="text-muted-foreground">
            Track and manage objectives and key results
          </p>
        </div>
        
        <Dialog open={isNewOKROpen} onOpenChange={setIsNewOKROpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Objective
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Objective</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Objective Title</Label>
                <Input id="title" placeholder="Enter objective title..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the objective..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Input id="owner" placeholder="Assign to..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Key Results</Label>
                <div className="space-y-2">
                  <Input placeholder="Key result 1..." />
                  <Input placeholder="Key result 2..." />
                  <Input placeholder="Key result 3..." />
                </div>
                <Button variant="outline" size="sm">Add More Key Results</Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewOKROpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewOKROpen(false)}>
                  Create Objective
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Objectives</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeOKRs.map((okr) => (
            <Card key={okr.id} className="neumorph-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {okr.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{okr.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {okr.dueDate}
                      </span>
                      <span>Owner: {okr.owner}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge 
                      variant={okr.status === "On Track" ? "default" : "destructive"}
                      className={
                        okr.status === "On Track" ? "status-on-track" :
                        okr.status === "At Risk" ? "status-at-risk" :
                        "status-blocked"
                      }
                    >
                      {okr.status}
                    </Badge>
                    <div className="text-2xl font-bold">{okr.progress}%</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{okr.progress}%</span>
                    </div>
                    <Progress value={okr.progress} className="h-3" />
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="keyResults">
                      <AccordionTrigger>
                        Key Results ({okr.keyResults.length})
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {okr.keyResults.map((kr) => (
                          <div key={kr.id} className="space-y-3 border-l-2 border-muted pl-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h4 className="font-medium">{kr.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {kr.current} / {kr.target} {kr.title.includes('%') ? '%' : 'units'}
                                </p>
                              </div>
                              <Badge 
                                variant="outline"
                                className={
                                  kr.status === "Ahead" || kr.status === "On Track" ? "status-on-track" :
                                  kr.status === "At Risk" ? "status-at-risk" :
                                  "status-blocked"
                                }
                              >
                                {kr.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{kr.progress}%</span>
                              </div>
                              <Progress value={kr.progress} className="h-2" />
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm">{kr.lastUpdate}</p>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Update Progress
                              </Button>
                              <Button size="sm" variant="ghost" className="gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Comment
                              </Button>
                              {kr.status === "Blocked" && (
                                <Button size="sm" variant="ghost" className="gap-1 text-red-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  View Blocker
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      Edit Objective
                    </Button>
                    <Button variant="ghost">
                      View History
                    </Button>
                    <Button variant="ghost">
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedOKRs.map((okr) => (
            <Card key={okr.id} className="neumorph-card opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      {okr.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{okr.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Completed: {okr.completedDate}</span>
                      <span>Owner: {okr.owner}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="status-on-track">
                      {okr.status}
                    </Badge>
                    <div className="text-2xl font-bold text-green-600">{okr.progress}%</div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OKRs;