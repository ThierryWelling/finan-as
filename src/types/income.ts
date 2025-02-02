export interface Income {
  id: string;
  type: 'salário' | 'investimento' | 'freelance' | 'aluguel' | 'outros';
  amount: number;
  description: string;
  category?: string;
  date: string;
  expected_date?: string;
  recurring: boolean;
  frequency: 'mensal' | 'semanal' | 'anual' | 'único';
  status: 'pendente' | 'recebido' | 'atrasado';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIncomeDTO {
  type: Income['type'];
  amount: number;
  description: string;
  category?: string;
  date: string;
  expected_date?: string;
  recurring?: boolean;
  frequency?: Income['frequency'];
  status?: Income['status'];
} 