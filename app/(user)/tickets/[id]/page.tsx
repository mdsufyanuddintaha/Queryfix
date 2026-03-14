import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/navbar";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReplyForm } from "@/components/tickets/reply-form";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect(`/admin/tickets/${id}`);

  // Fetch ticket without join
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  console.log("Ticket:", ticket, "Error:", error);

  if (!ticket) notFound();

  // Fetch replies without join
  const { data: replies } = await supabase
    .from("replies")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  // Fetch profiles for replies
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email");

  const repliesWithProfiles = replies?.map((reply: any) => ({
    ...reply,
    profiles: profiles?.find((p: any) => p.id === reply.user_id) || null,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile as Profile} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/tickets">
          <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to tickets
          </Button>
        </Link>

        <Card className="mb-6 animate-fade-in">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-bold tracking-tight leading-tight">
                {ticket.title}
              </h1>
              <StatusBadge status={ticket.status} className="shrink-0 mt-0.5" />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <PriorityBadge priority={ticket.priority} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="w-3 h-3" />
                {ticket.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatDate(ticket.created_at)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          {repliesWithProfiles && repliesWithProfiles.length > 0 && (
            <h2 className="text-sm font-medium text-muted-foreground">
              {repliesWithProfiles.length}{" "}
              {repliesWithProfiles.length === 1 ? "reply" : "replies"}
            </h2>
          )}
          {repliesWithProfiles?.map((reply: any) => (
            <div
              key={reply.id}
              className={`flex gap-3 animate-fade-in ${
                reply.is_admin ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <Avatar className="w-8 h-8 shrink-0 border border-border">
                <AvatarFallback className="text-xs bg-muted">
                  {getInitials(reply.profiles?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex-1 max-w-[85%] ${
                  reply.is_admin ? "" : "items-end flex flex-col"
                }`}
              >
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    reply.is_admin
                      ? "bg-muted text-foreground rounded-tl-sm"
                      : "bg-foreground text-background rounded-tr-sm"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {reply.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-xs text-muted-foreground">
                    {reply.is_admin ? "Support Team" : "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(reply.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ticket.status !== "closed" ? (
          <ReplyForm ticketId={ticket.id} userId={user.id} isAdmin={false} />
        ) : (
          <div className="text-center py-8 border border-border rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground">
              This ticket has been closed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}