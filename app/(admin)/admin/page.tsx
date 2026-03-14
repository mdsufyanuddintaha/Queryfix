import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketIcon, Users, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Profile } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email");

  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, role");

  const ticketsWithProfiles = tickets?.map((ticket: any) => ({
    ...ticket,
    profiles: profiles?.find((p: any) => p.id === ticket.user_id) || null,
  }));

  const allTickets = ticketsWithProfiles || [];

  console.log("ADMIN TICKETS:", allTickets.length, "ERROR:", ticketsError?.message);

  const stats = {
    total: allTickets.length,
    open: allTickets.filter((t: any) => t.status === "open").length,
    pending: allTickets.filter((t: any) => t.status === "pending").length,
    closed: allTickets.filter((t: any) => t.status === "closed").length,
    users: allProfiles?.filter((p: any) => p.role === "user").length || 0,
    highPriority: allTickets.filter((t: any) => t.priority === "high" && t.status !== "closed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile as Profile} isAdmin />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to all support tickets
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, icon: TicketIcon, color: "text-foreground" },
            { label: "Open", value: stats.open, icon: AlertCircle, color: "text-emerald-500" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
            { label: "Closed", value: stats.closed, icon: CheckCircle, color: "text-gray-400" },
            { label: "Users", value: stats.users, icon: Users, color: "text-blue-500" },
            { label: "High Priority", value: stats.highPriority, icon: TrendingUp, color: "text-red-500" },
          ].map((stat) => (
            <Card key={stat.label} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="open">
          <TabsList className="mb-6">
            <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({stats.closed})</TabsTrigger>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            <TicketList data={allTickets.filter((t: any) => t.status === "open")} />
          </TabsContent>
          <TabsContent value="pending">
            <TicketList data={allTickets.filter((t: any) => t.status === "pending")} />
          </TabsContent>
          <TabsContent value="closed">
            <TicketList data={allTickets.filter((t: any) => t.status === "closed")} />
          </TabsContent>
          <TabsContent value="all">
            <TicketList data={allTickets} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function TicketList({ data }: { data: any[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
              <TicketIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No tickets found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.map((ticket: any) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {ticket.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ticket.profiles?.full_name || "Unknown"} ·{" "}
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
  );
}