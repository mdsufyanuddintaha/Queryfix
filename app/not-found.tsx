import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TicketIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mb-6">
        <TicketIcon className="w-6 h-6 text-background" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
      <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
      <Link href="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
