export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      income: {
        Row: {
          id: string
          type: 'salário' | 'investimento' | 'freelance' | 'aluguel' | 'outros'
          amount: number
          description: string
          category: string | null
          date: string
          expected_date: string | null
          recurring: boolean
          frequency: 'mensal' | 'semanal' | 'anual' | 'único'
          status: 'pendente' | 'recebido' | 'atrasado'
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'salário' | 'investimento' | 'freelance' | 'aluguel' | 'outros'
          amount: number
          description: string
          category?: string | null
          date: string
          expected_date?: string | null
          recurring?: boolean
          frequency?: 'mensal' | 'semanal' | 'anual' | 'único'
          status?: 'pendente' | 'recebido' | 'atrasado'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'salário' | 'investimento' | 'freelance' | 'aluguel' | 'outros'
          amount?: number
          description?: string
          category?: string | null
          date?: string
          expected_date?: string | null
          recurring?: boolean
          frequency?: 'mensal' | 'semanal' | 'anual' | 'único'
          status?: 'pendente' | 'recebido' | 'atrasado'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          description: string
          amount: number
          type: 'entrada' | 'saída'
          category: string
          date: string
          payment_method: 'dinheiro' | 'cartão' | 'pix' | 'transferência'
          status: 'concluída' | 'pendente' | 'cancelada'
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          type: 'entrada' | 'saída'
          category: string
          date: string
          payment_method: 'dinheiro' | 'cartão' | 'pix' | 'transferência'
          status?: 'concluída' | 'pendente' | 'cancelada'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          type?: 'entrada' | 'saída'
          category?: string
          date?: string
          payment_method?: 'dinheiro' | 'cartão' | 'pix' | 'transferência'
          status?: 'concluída' | 'pendente' | 'cancelada'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          title: string
          amount: number
          category: string
          start_date: string
          end_date: string
          status: 'ativo' | 'concluído' | 'cancelado'
          progress: number
          description: string
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          amount: number
          category: string
          start_date: string
          end_date: string
          status?: 'ativo' | 'concluído' | 'cancelado'
          progress?: number
          description: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          category?: string
          start_date?: string
          end_date?: string
          status?: 'ativo' | 'concluído' | 'cancelado'
          progress?: number
          description?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'danger'
          status: 'novo' | 'lido' | 'arquivado'
          priority: 'baixa' | 'média' | 'alta'
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type: 'info' | 'warning' | 'danger'
          status?: 'novo' | 'lido' | 'arquivado'
          priority?: 'baixa' | 'média' | 'alta'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'danger'
          status?: 'novo' | 'lido' | 'arquivado'
          priority?: 'baixa' | 'média' | 'alta'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      suggestions: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          impact: 'baixo' | 'médio' | 'alto'
          status: 'pendente' | 'implementada' | 'rejeitada'
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          impact?: 'baixo' | 'médio' | 'alto'
          status?: 'pendente' | 'implementada' | 'rejeitada'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          impact?: 'baixo' | 'médio' | 'alto'
          status?: 'pendente' | 'implementada' | 'rejeitada'
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 