'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getFinancialRecommendations } from '@/lib/google-ai';

interface Despesa {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  priority: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'pago';
}

interface ObjetivoFinanceiro {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'alta' | 'media' | 'baixa';
  category: 'essencial' | 'investimento' | 'sonho';
}

export default function RelevanciaFinanceira() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [objetivos, setObjetivos] = useState<ObjetivoFinanceiro[]>([]);
  const [saldoDisponivel, setSaldoDisponivel] = useState(0);
  const [analiseDePrioridades, setAnaliseDePrioridades] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      // Carregar transações para calcular saldo
      const { data: transacoes } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      // Calcular saldo disponível
      const saldo = transacoes?.reduce((acc, trans) => {
        return trans.type === 'income' ? acc + trans.amount : acc - trans.amount;
      }, 0) || 0;

      setSaldoDisponivel(saldo);

      // Carregar despesas pendentes
      const { data: despesasPendentes } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'expense')
        .eq('status', 'pendente');

      if (despesasPendentes) {
        setDespesas(despesasPendentes);
      }

      // Carregar objetivos financeiros
      const { data: objetivosAtivos } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('status', 'active');

      if (objetivosAtivos) {
        setObjetivos(objetivosAtivos);
      }

      // Gerar análise de prioridades
      await gerarAnalisePrioridades(saldo, despesasPendentes || [], objetivosAtivos || []);

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  }

  async function gerarAnalisePrioridades(saldo: number, despesas: Despesa[], objetivos: ObjetivoFinanceiro[]) {
    try {
      const prompt = `
        Analise a situação financeira e priorize os pagamentos e objetivos:
        
        Saldo Disponível: R$ ${saldo}
        
        Despesas Pendentes:
        ${JSON.stringify(despesas, null, 2)}
        
        Objetivos Financeiros:
        ${JSON.stringify(objetivos, null, 2)}
        
        Por favor, forneça:
        1. Classificação de prioridade para cada despesa
        2. Ordem recomendada de pagamentos
        3. Sugestão de alocação para objetivos
        4. Alertas sobre possíveis riscos financeiros
        5. Recomendações para otimizar o orçamento
      `;

      const recomendacao = await getFinancialRecommendations([], objetivos, []);
      setAnaliseDePrioridades(recomendacao);
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
    }
  }

  async function atualizarPrioridades() {
    setLoading(true);
    try {
      // Atualizar prioridades das despesas
      for (const despesa of despesas) {
        await supabase
          .from('transactions')
          .update({ priority: despesa.priority })
          .eq('id', despesa.id);
      }

      // Atualizar prioridades dos objetivos
      for (const objetivo of objetivos) {
        await supabase
          .from('financial_goals')
          .update({ priority: objetivo.priority })
          .eq('id', objetivo.id);
      }

      await carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar prioridades:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Relevância Financeira</h1>

      {/* Saldo Disponível */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Saldo Disponível</h2>
        <p className="text-3xl font-bold text-blue-600">
          R$ {saldoDisponivel.toFixed(2)}
        </p>
      </div>

      {/* Despesas Pendentes */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Despesas Pendentes</h2>
        <div className="space-y-4">
          {despesas.map((despesa) => (
            <div key={despesa.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{despesa.description}</h3>
                  <p className="text-sm text-gray-600">Vencimento: {new Date(despesa.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {despesa.amount.toFixed(2)}</p>
                  <span className={`text-sm px-2 py-1 rounded ${
                    despesa.priority === 'alta' ? 'bg-red-100 text-red-800' :
                    despesa.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {despesa.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objetivos Financeiros */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Objetivos Financeiros</h2>
        <div className="space-y-6">
          {objetivos.map((objetivo) => (
            <div key={objetivo.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-semibold">{objetivo.title}</h3>
                  <p className="text-sm text-gray-600">
                    Categoria: {objetivo.category} | Prioridade: {objetivo.priority}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Meta: R$ {objetivo.targetAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    Acumulado: R$ {objetivo.currentAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(objetivo.currentAmount / objetivo.targetAmount) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Análise de Prioridades */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Análise de Prioridades</h2>
        <div className="prose max-w-none mb-6">
          {analiseDePrioridades ? (
            <div dangerouslySetInnerHTML={{ __html: analiseDePrioridades.replace(/\n/g, '<br>') }} />
          ) : (
            <p>Gerando análise de prioridades...</p>
          )}
        </div>
        <button
          onClick={atualizarPrioridades}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Atualizando...' : 'Atualizar Prioridades'}
        </button>
      </div>
    </div>
  );
} 