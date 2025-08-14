"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
import Image from "next/image";

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
  { title: "Users", url: "/users", icon: Users, roles: ["admin"] },
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
    (item) => user?.role && item.roles.includes(user.role),
  );

  return (
    <Sidebar className="bg-white border-r border-gray-200 w-[260px]">
      {/* Header */}
      <SidebarHeader className="px-8 py-6">
        <div>
          <Image
            src="/logo.svg"
            alt="abex.work"
            width={120}
            height={20}
            priority
          />
          <div className="mt-1 flex items-baseline">
            <span className="text-[22px] font-extrabold tracking-tight text-gray-900">
              OKR
            </span>
            <span
              aria-hidden
              className="ml-1.5 inline-block h-2 w-2 rounded-full bg-[#FF8A5B] translate-y-[-2px]"
            />
          </div>
          <div className="mt-5 h-px w-full bg-gray-200" />
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                        isActive
                          ? "bg-[#FFF4F0] text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                            isActive ? "text-[#FF8A5B]" : "text-gray-400 "
                          }`}
                        />
                        <span className="truncate">{item.title}</span>
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
