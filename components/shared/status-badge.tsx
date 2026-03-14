import { cn, getStatusColor, getPriorityColor } from "@/lib/utils";
import { TicketStatus, TicketPriority } from "@/types";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        getStatusColor(status),
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full", {
          "bg-emerald-500": status === "open",
          "bg-amber-500": status === "pending",
          "bg-gray-400": status === "closed",
        })}
      />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        getPriorityColor(priority),
        className
      )}
    >
      {priority}
    </span>
  );
}
