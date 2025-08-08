import { useState } from "react";
import { 
  Home, 
  Target, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Bell,
  ChevronRight,
  BarChart3,
  UserCheck
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/userStore";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { userRole } = useUserStore();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: userRole === "Employee" ? "My OKRs" : "Team OKRs", url: "/okrs", icon: Target },
      { title: "Calendar", url: "/calendar", icon: Calendar },
    ];

    const roleSpecificItems = {
      Admin: [
        { title: "Teams", url: "/teams", icon: Users },
        { title: "Reports", url: "/reports", icon: BarChart3 },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
      "Team Lead": [
        { title: "My Team", url: "/team", icon: UserCheck },
        { title: "Reports", url: "/reports", icon: FileText },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
      Employee: [
        { title: "My Team", url: "/team", icon: Users },
        { title: "History", url: "/history", icon: FileText },
        { title: "Settings", url: "/settings", icon: Settings },
      ]
    };

    return [...baseItems, ...roleSpecificItems[userRole]];
  };

  const navigationItems = getNavigationItems();
  const isExpanded = navigationItems.some((item) => isActive(item.url));

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
      isActive 
        ? "bg-primary text-primary-foreground shadow-sm" 
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`;

  return (
    <Sidebar
      className={`border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarContent className="px-4 py-6">
        {/* Logo/Title */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold">OKR Dashboard</h1>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && isActive(item.url) && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Notifications */}
        <SidebarGroup className="mt-8">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/notifications"
                    className={getNavClassName}
                  >
                    <Bell className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span>Notifications</span>
                        <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
                          3
                        </Badge>
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}