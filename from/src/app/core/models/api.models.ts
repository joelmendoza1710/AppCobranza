export interface AuthResponse {
  token: string;
}

export interface User {
  username: string;
  role: string;
}

export interface Loan {
  id: number;
  amount: number;
  interestPercentage: number;
  installments: number;
  paymentFrequency: 'DAILY' | 'WEEKLY';
  installmentAmount: number;
  startDate: string;
  endDate: string;
  totalToPay: number;
  remainingBalance: number;
  status: 'ACTIVE' | 'PAID';
  client: Client;
}

export interface Client {
  id: number;
  name: string;
  dni: string;
  address?: string;
  phone?: string;
  routeOrder?: number;
}

export interface Summary {
  totalCollected: number;
  totalSpent: number;
  netCash: number;
  activeLoans?: number; // Optional if we still want it, but DailySummaryDTO covers cash flow
  collectedToday?: number; // Legacy, map to totalCollected
  cashOnHand?: number; // Legacy, map to netCash
  expensesToday?: number;
}

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  category: 'FOOD' | 'FUEL' | 'MAINTENANCE' | 'OTHER';
  date?: string;
}

export interface RouteDTO {
  clientId: number;
  clientName: string;
  address: string;
  routeOrder: number;
  statusToday: 'PAID' | 'SKIPPED' | 'PENDING';
  paidTodayAmount: number;
  loanId: number;
  installmentAmount: number;
  remainingBalance: number;
}
