export type TicketStatus = "open" | "pending" | "closed";
export type TicketPriority = "low" | "medium" | "high";
export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Reply {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface TicketWithReplies extends Ticket {
  replies: Reply[];
}

export interface DashboardStats {
  total: number;
  open: number;
  pending: number;
  closed: number;
}
