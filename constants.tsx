
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  PieChart, 
  KanbanSquare, 
  ShieldAlert, 
  ClipboardList, 
  Package, 
  UserCheck,
  User
} from 'lucide-react';
import { Lead, Customer, Deal, SupportTicket, Activity, EmployeeLog } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'leads', label: 'Lead Management', icon: <Users size={20} /> },
  { id: 'customers', label: 'Customer Profiles', icon: <UserSquare2 size={20} /> },
  { id: 'pipeline', label: 'Sales Pipeline', icon: <KanbanSquare size={20} /> },
  { id: 'support', label: 'Help Desk', icon: <ShieldAlert size={20} /> },
  { id: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
  { id: 'tracking', label: 'Employee Tracking', icon: <UserCheck size={20} /> },
  { id: 'reports', label: 'Analytics', icon: <PieChart size={20} /> },
  { id: 'profile', label: 'User Profile', icon: <User size={20} /> },
];

export const MOCK_LEADS: Lead[] = [
  { id: 'L1', name: 'John Miller', company: 'TechFlow Inc', email: 'john@techflow.com', status: 'New', score: 85, lastContact: '2023-10-24', estimatedValue: 12000 },
  { id: 'L2', name: 'Sarah Chen', company: 'GreenLeaf Ltd', email: 'sarah@greenleaf.com', status: 'Qualified', score: 92, lastContact: '2023-10-25', estimatedValue: 45000 },
  { id: 'L3', name: 'Mike Ross', company: 'Pearson Hardman', email: 'mike@ph.com', status: 'Contacted', score: 45, lastContact: '2023-10-22', estimatedValue: 8000 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C1', name: 'Alice Wonderland', email: 'alice@wonder.co', phone: '555-0101', company: 'Wonderland Enterprizes', totalSpent: 125000, lastPurchase: '2023-09-15', notes: ['High value client', 'Requested q4 discount'] },
  { id: 'C2', name: 'Bob Builder', email: 'bob@fixit.com', phone: '555-0202', company: 'FixIt Solutions', totalSpent: 45000, lastPurchase: '2023-10-10', notes: ['Loyal since 2020'] },
];

export const MOCK_DEALS: Deal[] = [
  { id: 'D1', title: 'Enterprise Migration', company: 'Globex Corp', value: 250000, stage: 'Negotiation', probability: 75 },
  { id: 'D2', title: 'Cloud Integration', company: 'Soylent Corp', value: 85000, stage: 'Proposal', probability: 40 },
  { id: 'D3', title: 'Security Audit', company: 'Wayne Enterprises', value: 50000, stage: 'Closed Won', probability: 100 },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { 
    id: 'T1', 
    subject: 'Login issue', 
    customer: 'Alice Wonderland', 
    priority: 'High', 
    status: 'Open', 
    createdAt: '2023-10-26 09:00',
    description: 'Customer reports being unable to log into the main enterprise dashboard. Receives 403 Forbidden error after valid authentication.',
    messages: [
      { id: 'M1', sender: 'Alice Wonderland', text: 'I cannot log in to the dashboard anymore. Please help!', timestamp: '2023-10-26 09:00', isAdmin: false },
      { id: 'M2', sender: 'Support Team', text: 'Hello Alice, we are investigating the 403 error. Are you using a VPN?', timestamp: '2023-10-26 09:15', isAdmin: true }
    ]
  },
  { 
    id: 'T2', 
    subject: 'Billing inquiry', 
    customer: 'Bob Builder', 
    priority: 'Medium', 
    status: 'In Progress', 
    createdAt: '2023-10-25 14:30',
    description: 'User is questioning the Q3 service charge for Cloud Storage 1TB. Asserts the discount from 2020 should still apply.',
    messages: [
      { id: 'M3', sender: 'Bob Builder', text: 'My invoice looks wrong. It should have the loyalty discount.', timestamp: '2023-10-25 14:30', isAdmin: false },
      { id: 'M4', sender: 'Support Team', text: 'Checking your account history now, Bob.', timestamp: '2023-10-25 15:00', isAdmin: true }
    ]
  },
  { 
    id: 'T3', 
    subject: 'API Timeout', 
    customer: 'Sarah Chen', 
    priority: 'High', 
    status: 'Resolved', 
    createdAt: '2023-10-24 10:00',
    description: 'Webhook delivery failures on the production endpoint during peak hours.',
    messages: [
      { id: 'M5', sender: 'Sarah Chen', text: 'We are getting timeouts on the webhook calls.', timestamp: '2023-10-24 10:00', isAdmin: false },
      { id: 'M6', sender: 'Support Team', text: 'We scaled up the listener service. Should be fine now.', timestamp: '2023-10-24 11:30', isAdmin: true },
      { id: 'M7', sender: 'Sarah Chen', text: 'Confirmed, everything is stable. Thanks!', timestamp: '2023-10-24 12:00', isAdmin: false }
    ]
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'A1', user: 'Admin', action: 'Closed deal with Wayne Enterprises', timestamp: '2h ago', type: 'sale' },
  { id: 'A2', user: 'System', action: 'Lead scoring updated for 15 records', timestamp: '4h ago', type: 'system' },
  { id: 'A3', user: 'Support', action: 'Resolved ticket T442', timestamp: '5h ago', type: 'support' },
];

export const MOCK_EMPLOYEE_LOGS: EmployeeLog[] = [
  { id: 'E1', employeeName: 'Jane Smith', checkIn: '08:30 AM', checkOut: null, location: 'New York HQ', status: 'Active' },
  { id: 'E2', employeeName: 'Mark Wilson', checkIn: '09:15 AM', checkOut: '05:00 PM', location: 'Remote', status: 'Offline' },
  { id: 'E3', employeeName: 'Robert Fox', checkIn: '09:00 AM', checkOut: null, location: 'Chicago Branch', status: 'Active' },
];

export const MOCK_INVENTORY = [
  { id: 'P1', name: 'Enterprise License', sku: 'LIC-ENT-001', category: 'Software', price: 1200, stock: 45 },
  { id: 'P2', name: 'Cloud Storage 1TB', sku: 'CLD-ST-1TB', category: 'Service', price: 200, stock: 120 },
  { id: 'P3', name: 'Security Gateway', sku: 'HW-SEC-GT', category: 'Hardware', price: 4500, stock: 12 },
];
