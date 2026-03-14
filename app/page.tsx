import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TicketIcon, ShieldCheckIcon, ZapIcon, HeadphonesIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <TicketIcon className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">QueryFix</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Support system — always on
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-none mb-6">
            Support that
            <br />
            <span className="text-muted-foreground">actually works.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Raise tickets, get responses, resolve issues. A clean, minimal helpdesk
            for teams who value their time.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base">
                Raise a Ticket
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto w-full">
          {[
            {
              icon: ZapIcon,
              title: "Instant Notifications",
              desc: "Get email alerts the moment your ticket is updated or replied to.",
            },
            {
              icon: ShieldCheckIcon,
              title: "Priority Management",
              desc: "Assign low, medium, or high priority so critical issues get resolved first.",
            },
            {
              icon: HeadphonesIcon,
              title: "Admin Dashboard",
              desc: "Full visibility into all tickets with powerful filtering and reply tools.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="border border-border rounded-xl p-6 bg-card hover:bg-muted/30 transition-colors animate-fade-in"
            >
              <div className="w-10 h-10 bg-foreground/5 border border-border rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} QueryFix. Built with Next.js, Supabase & shadcn/ui.
        </div>
      </footer>
    </div>
  );
}
