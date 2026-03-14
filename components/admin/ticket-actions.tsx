"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { CheckCircle, RefreshCw, Loader2, Clock } from "lucide-react";
import { Ticket } from "@/types";

interface TicketActionsProps {
  ticket: Ticket;
}

export function TicketActions({ ticket }: TicketActionsProps) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  async function handleUpdate() {
    setLoading(true);
    const { error } = await supabase
      .from("tickets")
      .update({ status, priority, updated_at: new Date().toISOString() })
      .eq("id", ticket.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ticket updated!", description: "Changes saved successfully." });
      router.refresh();
    }
    setLoading(false);
  }

  async function handleClose() {
    setLoading(true);
    const { error } = await supabase
      .from("tickets")
      .update({ status: "closed", updated_at: new Date().toISOString() })
      .eq("id", ticket.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStatus("closed");
      toast({ title: "Ticket closed", description: "The ticket has been resolved." });
      router.refresh();
    }
    setLoading(false);
  }

  async function handleReopen() {
    setLoading(true);
    const { error } = await supabase
      .from("tickets")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", ticket.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStatus("open");
      toast({ title: "Ticket reopened", description: "The ticket is now open again." });
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-sm font-semibold">Ticket Actions</h3>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">🟢 Open</SelectItem>
              <SelectItem value="pending">🟡 Pending</SelectItem>
              <SelectItem value="closed">⚫ Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🟢 Low</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="high">🔴 High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleUpdate}
          disabled={loading}
          size="sm"
          className="w-full gap-2"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Save Changes
        </Button>

        <div className="border-t border-border pt-3">
          {ticket.status !== "closed" ? (
            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outline"
              size="sm"
              className="w-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Close Ticket
            </Button>
          ) : (
            <Button
              onClick={handleReopen}
              disabled={loading}
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
              Reopen Ticket
            </Button>
          )}
        </div>

        <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
          <p>ID: <span className="font-mono">{ticket.id.slice(0, 8)}...</span></p>
          <p>Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
          <p>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
