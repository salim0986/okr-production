import { Bell, Search, Settings, LogOut, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/userStore";

export function TopNav() {
  const { userName, userEmail, userRole, setUserRole } = useUserStore();

  const handleRoleChange = (newRole: 'Admin' | 'Team Lead' | 'Employee') => {
    setUserRole(newRole);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search OKRs, teams, or people..."
            className="pl-10 w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Role Switcher for Demo */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Role:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {userRole}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleRoleChange('Admin')}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange('Team Lead')}>
                Team Lead
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange('Employee')}>
                Employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1">
              <div className="p-2 text-sm">
                <div className="font-medium">New comment on Q1 Revenue OKR</div>
                <div className="text-muted-foreground">Sarah added feedback to your key result</div>
                <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
              </div>
              <div className="p-2 text-sm">
                <div className="font-medium">OKR deadline approaching</div>
                <div className="text-muted-foreground">Complete user research by Friday</div>
                <div className="text-xs text-muted-foreground mt-1">1 hour ago</div>
              </div>
              <div className="p-2 text-sm">
                <div className="font-medium">Team meeting scheduled</div>
                <div className="text-muted-foreground">OKR review meeting tomorrow at 2 PM</div>
                <div className="text-xs text-muted-foreground mt-1">3 hours ago</div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={userName} />
                <AvatarFallback className="text-xs">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}