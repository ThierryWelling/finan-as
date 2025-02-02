export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  userId: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIRecommendation {
  id: string;
  type: 'saving' | 'investment' | 'budget_adjustment';
  description: string;
  impact: number;
  priority: 'high' | 'medium' | 'low';
  userId: string;
  createdAt: string;
  implementedAt?: string;
} 