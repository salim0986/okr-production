import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  MessageSquare, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Trash2,
  Check
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "comment",
      title: "New comment on Q1 Revenue OKR",
      message: "Sarah Chen added feedback to your key result: 'Great progress on the new features!'",
      sender: "Sarah Chen",
      senderAvatar: "/placeholder.svg",
      timestamp: "2 minutes ago",
      read: false,
      okr: "Increase User Engagement"
    },
    {
      id: 2,
      type: "deadline",
      title: "OKR deadline approaching",
      message: "Complete security audit by Friday (March 15, 2024)",
      sender: "System",
      senderAvatar: null,
      timestamp: "1 hour ago",
      read: false,
      okr: "Improve Development Velocity"
    },
    {
      id: 3,
      type: "progress",
      title: "Progress update from team member",
      message: "Alice Johnson updated progress on API Performance Optimization from 70% to 85%",
      sender: "Alice Johnson",
      senderAvatar: "/placeholder.svg",
      timestamp: "3 hours ago",
      read: false,
      okr: "Improve Development Velocity"
    },
    {
      id: 4,
      type: "blocker",
      title: "New blocker reported",
      message: "Carol Smith reported a blocker on User Research Initiative: 'Waiting for legal approval'",
      sender: "Carol Smith",
      senderAvatar: "/placeholder.svg",
      timestamp: "5 hours ago",
      read: true,
      okr: "Product Strategy"
    },
    {
      id: 5,
      type: "meeting",
      title: "Team meeting scheduled",
      message: "OKR review meeting scheduled for tomorrow at 2:00 PM",
      sender: "Mike Johnson",
      senderAvatar: "/placeholder.svg",
      timestamp: "1 day ago",
      read: true,
      okr: "Team Collaboration"
    },
    {
      id: 6,
      type: "completion",
      title: "Key result completed",
      message: "Bob Chen completed Design System v2 ahead of schedule",
      sender: "Bob Chen",
      senderAvatar: "/placeholder.svg",
      timestamp: "2 days ago",
      read: true,
      okr: "Improve Development Velocity"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "deadline":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "progress":
        return <Target className="h-4 w-4 text-green-500" />;
      case "blocker":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "completion":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const NotificationItem = ({ notification, showActions = true }: { notification: any, showActions?: boolean }) => (
    <div className={`p-4 border-b last:border-b-0 ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
      <div className="flex gap-3">
        <div className="mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {notification.sender !== "System" && (
                  <>
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={notification.senderAvatar} alt={notification.sender} />
                      <AvatarFallback className="text-xs">
                        {notification.sender.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{notification.sender}</span>
                    <span>•</span>
                  </>
                )}
                <span>{notification.timestamp}</span>
              </div>
            </div>
            {!notification.read && (
              <Badge variant="destructive" className="text-xs px-2 py-0">
                New
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {notification.okr}
            </Badge>
            
            {showActions && (
              <div className="flex gap-1">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark as read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNotification(notification.id)}
                  className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your OKR activity and team updates
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="gap-2">
            <Check className="h-4 w-4" />
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>

        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'comment').length}
            </div>
          </CardContent>
        </Card>

        <Card className="neumorph-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'deadline').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                All Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                  {unreadCount}
                </Badge>
                Unread Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {unreadNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>All caught up! No unread notifications.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {unreadNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="read" className="space-y-6">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Read Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {readNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No read notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {readNotifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;