import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  User, 
  Bell, 
  Shield, 
  Calendar, 
  Users, 
  MoreHorizontal,
  Upload,
  Save,
  Settings as SettingsIcon
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const Settings = () => {
  const { userRole, userName, userEmail, setUserName, setUserEmail } = useUserStore();
  const [notifications, setNotifications] = useState({
    emailComments: true,
    emailUpdates: true,
    emailDeadlines: true,
    pushComments: false,
    pushUpdates: true,
    pushDeadlines: true,
  });

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
    bio: "Product enthusiast focused on user experience and data-driven decisions.",
    location: "San Francisco, CA",
    timezone: "UTC-8"
  });

  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@company.com", role: "Team Lead", status: "Active" },
    { id: 2, name: "Bob Chen", email: "bob@company.com", role: "Employee", status: "Active" },
    { id: 3, name: "Carol Smith", email: "carol@company.com", role: "Employee", status: "Inactive" },
    { id: 4, name: "David Wilson", email: "david@company.com", role: "Team Lead", status: "Active" },
  ];

  const handleSaveProfile = () => {
    setUserName(profile.name);
    setUserEmail(profile.email);
    // Here you would typically save to a backend
    console.log("Profile saved:", profile);
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          {userRole === "Admin" && <TabsTrigger value="users">Users</TabsTrigger>}
          {userRole === "Admin" && <TabsTrigger value="organization">Organization</TabsTrigger>}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Comments on my OKRs</p>
                      <p className="text-sm text-muted-foreground">Get notified when someone comments on your objectives</p>
                    </div>
                    <Switch
                      checked={notifications.emailComments}
                      onCheckedChange={(checked) => handleNotificationChange('emailComments', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Progress updates</p>
                      <p className="text-sm text-muted-foreground">Receive updates on OKR progress from your team</p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('emailUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Deadline reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming OKR deadlines</p>
                    </div>
                    <Switch
                      checked={notifications.emailDeadlines}
                      onCheckedChange={(checked) => handleNotificationChange('emailDeadlines', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Comments on my OKRs</p>
                      <p className="text-sm text-muted-foreground">Browser notifications for new comments</p>
                    </div>
                    <Switch
                      checked={notifications.pushComments}
                      onCheckedChange={(checked) => handleNotificationChange('pushComments', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Progress updates</p>
                      <p className="text-sm text-muted-foreground">Real-time notifications for team updates</p>
                    </div>
                    <Switch
                      checked={notifications.pushUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('pushUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Deadline reminders</p>
                      <p className="text-sm text-muted-foreground">Push notifications for upcoming deadlines</p>
                    </div>
                    <Switch
                      checked={notifications.pushDeadlines}
                      onCheckedChange={(checked) => handleNotificationChange('pushDeadlines', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Application Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Compact View</p>
                    <p className="text-sm text-muted-foreground">Show more information in less space</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Auto-save drafts</p>
                    <p className="text-sm text-muted-foreground">Automatically save your work as you type</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">OKR Preferences</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default OKR Cycle</Label>
                    <Select defaultValue="quarterly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Progress Update Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management (Admin only) */}
        {userRole === "Admin" && (
          <TabsContent value="users" className="space-y-6">
            <Card className="neumorph-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <Button className="gap-2">
                    <User className="h-4 w-4" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "Active" ? "default" : "secondary"}
                            className={user.status === "Active" ? "status-on-track" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          2 hours ago
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem>Reset Password</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Deactivate User
                              </DropdownMenuItem>
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
        )}

        {/* Organization Settings (Admin only) */}
        {userRole === "Admin" && (
          <TabsContent value="organization" className="space-y-6">
            <Card className="neumorph-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Organization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgDomain">Email Domain</Label>
                    <Input id="orgDomain" defaultValue="@acme.com" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">OKR Cycle Settings</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Default Cycle Length</Label>
                      <Select defaultValue="quarterly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Progress Update Requirement</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="optional">Optional</SelectItem>
                          <SelectItem value="weekly">Weekly Required</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Require two-factor authentication</p>
                        <p className="text-sm text-muted-foreground">Force all users to enable 2FA</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Password complexity requirements</p>
                        <p className="text-sm text-muted-foreground">Enforce strong password policies</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Organization Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;