"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Profile } from "@/types";

export default function NewTicketPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data, error } = await supabase.from("tickets").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      status: "open",
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Ticket created!", description: "Your support ticket has been submitted." });
    router.push(`/tickets`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link href="/tickets">
            <Button variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              Back to tickets
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Raise a Ticket</h1>
          <p className="text-muted-foreground mt-1">Describe your issue and our team will get back to you.</p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>Fill in the details about your support request.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Subject *</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={120}
                />
                <p className="text-xs text-muted-foreground text-right">{title.length}/120</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail. Include any steps to reproduce, error messages, or relevant context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Ticket
                </Button>
                <Link href="/tickets">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
}
