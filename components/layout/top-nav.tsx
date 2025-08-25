"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User, Settings } from "lucide-react";
import Link from "next/link";

export function TopNav() {
  const { user, logout } = useAuth();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="h-20 bg-gray-100 border border-slate-200 px-6 flex items-center shadow-sm rounded-full p-4">
      <div className="flex items-center justify-between w-full">
        {/* Left: Sidebar trigger + greeting */}
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className="h-9 w-9 rounded-lg border border-slate-100 bg-white hover:bg-slate-50"
            title="Toggle sidebar"
          />

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {getGreeting()}, {user?.name}
            </h1>
            <p className="text-sm text-gray-500">
              Here’s your OKR progress overview.
            </p>
          </div>
        </div>

        {/* Right: Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full border border-slate-100 hover:bg-slate-50"
              title="Account"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#FF8A5B] text-white font-medium">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg shadow-lg"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
