import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TicketPriority, TicketStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: TicketStatus): string {
  switch (status) {
    case "open":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "closed":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getPriorityColor(priority: TicketPriority): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
