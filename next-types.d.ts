/* eslint-disable @typescript-eslint/no-explicit-any */
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  email_type: string;
  contact_form_url: string;
  created_at: string;
  updated_at: string;
  agency_id: string;
  firm_id: string;
  department: string;
}

interface Agency {
  id: string;
  name: string;
  state: string;
  state_code: string;
  type: string;
  population: string;
  website: string;
  total_schools: string;
  total_students: string;
  mailing_address: string;
  grade_span: string;
  locale: string;
  csa_cbsa: string;
  domain_name: string;
  physical_address: string;
  phone: string;
  status: string;
  student_teacher_ratio: string;
  supervisory_union: string;
  county: string;
  created_at: string;
  updated_at: string;
}

interface WeekView {
  day: string;
  views: number;
}

interface ViewStatus {
  dailyViews: number;
  remainingViews: number;
  hasExceededLimit: boolean;
  viewedContacts: string[];
}

interface StatsGridProps {
  dailyViews: number;
  hasExceededLimit: boolean;
  variants: any;
}

interface StatData {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  color: string;
}