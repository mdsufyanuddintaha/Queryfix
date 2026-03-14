"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketIcon, LogOut, User, LayoutDashboard } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Profile } from "@/types";

interface NavbarProps {
  profile: Profile | null;
  isAdmin?: boolean;
}

export function Navbar({ profile, isAdmin = false }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <TicketIcon className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold tracking-tight">QueryFix</span>
            {isAdmin && (
              <span className="ml-1 text-xs bg-foreground text-background rounded px-1.5 py-0.5 font-medium">
                Admin
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {isAdmin ? (
              <>
                <Link href="/admin">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Link href="/admin/tickets">
                  <Button variant="ghost" size="sm">All Tickets</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Link href="/tickets">
                  <Button variant="ghost" size="sm">My Tickets</Button>
                </Link>
                <Link href="/tickets/new">
                  <Button variant="ghost" size="sm">New Ticket</Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="text-xs font-medium bg-muted">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={isAdmin ? "/admin" : "/dashboard"} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
