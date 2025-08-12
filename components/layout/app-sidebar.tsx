"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Target,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Bell,
  Building2,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "team_lead", "employee"],
  },
  {
    title: "OKRs",
    url: "/okrs",
    icon: Target,
    roles: ["admin", "team_lead", "employee"],
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    roles: ["admin", "team_lead", "employee"],
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
    roles: ["admin", "team_lead"],
  },
  // {
  //   title: "Reports",
  //   url: "/reports",
  //   icon: BarChart3,
  //   roles: ["admin", "team_lead"],
  // },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    roles: ["admin", "team_lead", "employee"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin", "team_lead", "employee"],
  },
];

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Target className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">OKR System</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
