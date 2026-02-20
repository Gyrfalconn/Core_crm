
export type UserRole = 'Admin' | 'Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  score: number;
  lastContact: string;
  estimatedValue: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalSpent: number;
  lastPurchase: string;
  notes: string[];
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'Prospect' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  description: string;
  messages: Message[];
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: 'sale' | 'lead' | 'support' | 'system';
}

export interface EmployeeLog {
  id: string;
  employeeName: string;
  checkIn: string;
  checkOut: string | null;
  location: string;
  status: 'Active' | 'Offline';
}
