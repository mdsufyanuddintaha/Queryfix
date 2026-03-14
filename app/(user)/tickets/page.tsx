import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { Plus, TicketIcon, ChevronRight } from "lucide-react";
import { Profile, Ticket } from "@/types";

export default async function TicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profile?.role === "admin") redirect("/admin");

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile as Profile} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Tickets</h1>
            <p className="text-muted-foreground mt-1">{tickets?.length || 0} total tickets</p>
          </div>
          <Link href="/tickets/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            {!tickets || tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                  <TicketIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No tickets yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first support ticket.</p>
                <Link href="/tickets/new"><Button size="sm"><Plus className="w-4 h-4 mr-2" />New Ticket</Button></Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {tickets.map((ticket: Ticket) => (
                  <Link key={ticket.id} href={`/tickets/${ticket.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{ticket.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(ticket.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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
