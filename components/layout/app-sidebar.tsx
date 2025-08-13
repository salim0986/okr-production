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
  Users,
  Group,
  Settings,
  Bell,
  CheckCircle,
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
    title: "Teams",
    url: "/teams",
    icon: Group,
    roles: ["admin", "team_lead", "employee"],
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    roles: ["admin", "team_lead", "employee"],
  },
  {
    title: "Checkins",
    url: "/checkins",
    icon: CheckCircle,
    roles: ["employee"],
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

  // Apply role-based title changes
  const updatedMenuItems = menuItems.map((item) => {
    if (
      item.title === "Teams" &&
      (user?.role === "team_lead" || user?.role === "employee")
    ) {
      return { ...item, title: "My Team" };
    }
    return item;
  });

  const filteredMenuItems = updatedMenuItems.filter(
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
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
