export type Role = "client" | "technician";

export type JobStatus =
  | "open"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: Role | null;
  city: string | null;
  created_at: string;
}

export interface TechnicianProfile {
  id: string;
  bio: string | null;
  category: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  is_available: boolean;
  is_verified: boolean;
  location_lat: number | null;
  location_lng: number | null;
  avg_rating: number | null;
}

export interface PortfolioPhoto {
  id: string;
  technician_id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
}

export interface JobRequest {
  id: string;
  client_id: string;
  technician_id: string | null;
  title: string;
  description: string | null;
  status: JobStatus;
  budget_min: number | null;
  budget_max: number | null;
  location: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  job_id: string;
  client_id: string;
  technician_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export type ProfileWithTechnician = Profile & {
  technician_profiles: TechnicianProfile | null;
};
