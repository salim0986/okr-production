import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Target, 
  TrendingUp,
  UserPlus,
  Settings
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const Teams = () => {
  const { userRole } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  const teams = [
    {
      id: 1,
      name: "Engineering",
      lead: "Sarah Chen",
      leadAvatar: "/placeholder.svg",
      memberCount: 8,
      avgCompletion: 85,
      status: "On Track",
      activeOKRs: 12,
      description: "Product development and technical infrastructure"
    },
    {
      id: 2,
      name: "Marketing",
      lead: "Mike Johnson",
      leadAvatar: "/placeholder.svg",
      memberCount: 5,
      avgCompletion: 92,
      status: "Ahead",
      activeOKRs: 6,
      description: "Brand awareness and customer acquisition"
    },
    {
      id: 3,
      name: "Sales",
      lead: "Emily Davis",
      leadAvatar: "/placeholder.svg",
      memberCount: 6,
      avgCompletion: 67,
      status: "At Risk",
      activeOKRs: 8,
      description: "Revenue generation and customer relationships"
    },
    {
      id: 4,
      name: "Product",
      lead: "Alex Kim",
      leadAvatar: "/placeholder.svg",
      memberCount: 7,
      avgCompletion: 78,
      status: "On Track",
      activeOKRs: 10,
      description: "Product strategy and user experience"
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@company.com",
      role: "Senior Developer",
      team: "Engineering",
      avatar: "/placeholder.svg",
      okrs: 2,
      completion: 85,
      status: "On Track",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Bob Chen",
      email: "bob@company.com",
      role: "UI Designer",
      team: "Engineering",
      avatar: "/placeholder.svg",
      okrs: 1,
      completion: 92,
      status: "Ahead",
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Carol Smith",
      email: "carol@company.com",
      role: "Product Manager",
      team: "Product",
      avatar: "/placeholder.svg",
      okrs: 3,
      completion: 67,
      status: "At Risk",
      lastActive: "3 hours ago"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@company.com",
      role: "Marketing Specialist",
      team: "Marketing",
      avatar: "/placeholder.svg",
      okrs: 2,
      completion: 94,
      status: "Ahead",
      lastActive: "30 minutes ago"
    },
    {
      id: 5,
      name: "Eva Martinez",
      email: "eva@company.com",
      role: "Sales Representative",
      team: "Sales",
      avatar: "/placeholder.svg",
      okrs: 2,
      completion: 72,
      status: "On Track",
      lastActive: "4 hours ago"
    }
  ];

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.lead.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const className = 
      status === "Ahead" || status === "On Track" ? "status-on-track" :
      status === "At Risk" ? "status-at-risk" :
      "status-blocked";
    
    return <Badge variant="outline" className={className}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === "Employee" ? "My Team" : "Teams & People"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "Employee" 
              ? "View your team members and their progress"
              : "Manage teams and track member performance"
            }
          </p>
        </div>
        
        {userRole === "Admin" && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search teams or members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">All Members</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="neumorph-card neumorph-card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {team.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {team.description}
                      </p>
                    </div>
                    {getStatusBadge(team.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Team Lead */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={team.leadAvatar} alt={team.lead} />
                      <AvatarFallback>{team.lead.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{team.lead}</p>
                      <p className="text-xs text-muted-foreground">Team Lead</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{team.memberCount}</div>
                      <div className="text-xs text-muted-foreground">Members</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{team.activeOKRs}</div>
                      <div className="text-xs text-muted-foreground">Active OKRs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{team.avgCompletion}%</div>
                      <div className="text-xs text-muted-foreground">Avg Progress</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Team Progress</span>
                      <span>{team.avgCompletion}%</span>
                    </div>
                    <Progress value={team.avgCompletion} className="h-2" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Members
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Target className="h-3 w-3" />
                      OKRs
                    </Button>
                    {userRole === "Admin" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit Team</DropdownMenuItem>
                          <DropdownMenuItem>Add Members</DropdownMenuItem>
                          <DropdownMenuItem>Generate Report</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>OKRs</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.team}</TableCell>
                      <TableCell>{member.okrs}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={member.completion} className="w-16 h-2" />
                          <span className="text-sm">{member.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(member.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.lastActive}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>View OKRs</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            {userRole === "Admin" && (
                              <>
                                <DropdownMenuItem>Assign OKR</DropdownMenuItem>
                                <DropdownMenuItem>Change Role</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Deactivate
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teams;