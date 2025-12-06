
export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardTab {
  OVERVIEW = 'OVERVIEW',
  SCHEDULE = 'SCHEDULE',
  PATIENTS = 'PATIENTS',
  FINANCIAL = 'FINANCIAL',
  ANAMNESIS = 'ANAMNESIS',
  SETTINGS = 'SETTINGS'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  DENTIST = 'DENTIST'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  specialty?: string; // e.g., 'Ortodontia', 'Implantodontia'
  avatarUrl?: string;
}

export interface AppSettings {
  clinicName: string;
  logoUrl: string;
  primaryColor: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string; // Format: 5511999999999
  lastVisit: string;
  status: 'Active' | 'Inactive';
  history?: string; // Anamnesis summary
  nextAppointment?: string;
}

export interface AnamnesisForm {
  allergies: string;
  medications: string;
  isSmoker: boolean;
  hasDiabetes: boolean;
  hasHeartCondition: boolean;
  isPregnant: boolean;
  hasBleedingProblem: boolean;
  hasGastricProblems: boolean;
  otherComorbidities: string;
  lastUpdate: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  dentistId: string; // New field to link to specific dentist
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:mm
  procedure: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';
  notes?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: string;
  category: string;
}

export interface KPIData {
  totalPatients: number;
  monthlyRevenue: number;
  appointmentsToday: number;
  pendingInvoices: number;
}

// N8N Payload Types
export interface N8NAnamnesisPayload {
  patientId: string;
  rawNotes: string;
  doctorName?: string;
}

export interface N8NMessagePayload {
  phone: string;
  patientName: string;
  type: 'REMINDER' | 'MARKETING' | 'RECEIPT' | 'PAYMENT_LINK';
  data?: any;
}