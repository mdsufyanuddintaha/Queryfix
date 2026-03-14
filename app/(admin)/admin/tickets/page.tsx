import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { TicketIcon, ChevronRight } from "lucide-react";
import { Profile } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTicketsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email");

  const allTickets = (tickets || []).map((ticket: any) => ({
    ...ticket,
    ownerName:
      profiles?.find((p: any) => p.id === ticket.user_id)?.full_name ||
      "Unknown",
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile as Profile} isAdmin />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">All Tickets</h1>
          <p className="text-muted-foreground mt-1">
            {allTickets.length} total tickets
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            {allTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4">
                  <TicketIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No tickets found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {allTickets.map((ticket: any) => (
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
                        {ticket.ownerName} · {formatDate(ticket.created_at)}
                      </p>
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