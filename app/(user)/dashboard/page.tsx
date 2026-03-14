import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { Plus, TicketIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Profile, Ticket } from "@/types";

export default async function UserDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin");

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter((t) => t.status === "open").length || 0,
    pending: tickets?.filter((t) => t.status === "pending").length || 0,
    closed: tickets?.filter((t) => t.status === "closed").length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile as Profile} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {profile?.full_name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your support tickets
            </p>
          </div>
          <Link href="/tickets/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tickets", value: stats.total, icon: TicketIcon, color: "text-foreground" },
            { label: "Open", value: stats.open, icon: AlertCircle, color: "text-emerald-500" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
            { label: "Closed", value: stats.closed, icon: CheckCircle, color: "text-gray-400" },
          ].map((stat) => (
            <Card key={stat.label} className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Tickets</CardTitle>
            <Link href="/tickets">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {!tickets || tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                  <TicketIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No tickets yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Raise your first support ticket to get started.
                </p>
                <Link href="/tickets/new">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {tickets.slice(0, 8).map((ticket: Ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(ticket.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}