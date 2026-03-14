"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";

interface ReplyFormProps {
  ticketId: string;
  userId: string;
  isAdmin: boolean;
}

export function ReplyForm({ ticketId, userId, isAdmin }: ReplyFormProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("replies").insert({
      ticket_id: ticketId,
      user_id: userId,
      message: message.trim(),
      is_admin: isAdmin,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Update ticket updated_at and status to pending if user replied
    if (!isAdmin) {
      await supabase
        .from("tickets")
        .update({ updated_at: new Date().toISOString(), status: "pending" })
        .eq("id", ticketId);
    } else {
      await supabase
        .from("tickets")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", ticketId);
    }

    setMessage("");
    toast({ title: "Reply sent!", description: "Your message has been posted." });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="border border-border rounded-xl bg-card p-4">
      <p className="text-sm font-medium mb-3">
        {isAdmin ? "Reply to customer" : "Add a reply"}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder={isAdmin ? "Write your response to the customer..." : "Describe your issue further or add more context..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="resize-none"
          required
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !message.trim()} className="gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Reply
          </Button>
        </div>
      </form>
    </div>
  );
}
