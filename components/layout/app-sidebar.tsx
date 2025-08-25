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
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Target,
  Users,
  Group,
  Settings,
  Bell,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

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
    (item) => user?.role && item.roles.includes(user.role)
  );

  return (
    <Sidebar className="bg-gray-100 rounded-[2rem] shadow-slate-100 border border-slate-200 w-[280px] p-4 m-3">
      {/* Header */}
      <SidebarHeader className="px-4 py-4">
        <div>
          <Image
            src="/logo.svg"
            alt="abex.work"
            width={130}
            height={40}
            priority
          />
          <div className="mt-1 flex items-baseline">
            <span className="text-[28px] font-extrabold tracking-tight text-gray-900">
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
      <SidebarContent>
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
                          ? "bg-[#FFF4F1] text-gray-900"
                          : "text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                      }`}
                    >
                      <Link href={item.url} className="text-lg font-semibold">
                        <item.icon
                          className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                            isActive ? "text-[#FF8A5B]" : "text-gray-500 "
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
      {/* Footer Help Button */}
      <SidebarFooter>
        <div className="bg-[#FF8A5B] rounded-3xl p-4 flex flex-col items-center text-center shadow-sm">
          {/* Heading + subtext */}
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">Need Help ?</span>
          </div>
          <p className="text-white/90 text-xs mb-3">Check our documentation</p>

          {/* White pill button */}
          <Button
            size="sm"
            className="w-full bg-white text-gray-800 hover:bg-gray-100 text-sm font-medium rounded-full"
          >
            Get Support
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
