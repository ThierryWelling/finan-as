'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getFinancialRecommendations } from '@/lib/google-ai';

interface Orcamento {
  id: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  priority: 'alta' | 'media' | 'baixa';
  status: 'ativo' | 'ajustado';
}

interface Receita {
  id: string;
  amount: number;
  type: 'fixa' | 'variavel';
  status: 'ativo' | 'inativo';
}

interface Transacao {
  id: string;
  amount: number;
  category: string;
  date: string;
}

export default function AjustesDinamicos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [ajustando, setAjustando] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState<string>('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      // Carregar orçamentos
      const { data: orcamentosData } = await supabase
        .from('budgets')
        .select('*')
        .eq('status', 'ativo');

      if (orcamentosData) {
        setOrcamentos(orcamentosData);
      }

      // Carregar receitas
      const { data: receitasData } = await supabase
        .from('income')
        .select('*')
        .eq('status', 'ativo');

      if (receitasData) {
        setReceitas(receitasData);
      }

      // Carregar transações recentes
      const { data: transacoesData } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString())
        .order('date', { ascending: false });

      if (transacoesData) {
        setTransacoes(transacoesData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  }

  async function analisarMudancas() {
    setAjustando(true);
    try {
      // Calcular total de receitas
      const totalReceitas = receitas.reduce((acc, receita) => acc + receita.amount, 0);

      // Calcular total de despesas recentes
      const totalDespesas = transacoes
        .filter(t => new Date(t.date) >= new Date(new Date().setDate(new Date().getDate() - 30)))
        .reduce((acc, trans) => acc + trans.amount, 0);

      // Calcular total alocado em orçamentos
      const totalOrcado = orcamentos.reduce((acc, orc) => acc + orc.allocated_amount, 0);

      // Obter recomendações da IA
      const recomendacoesIA = await getFinancialRecommendations(
        transacoes,
        [], // objetivos financeiros
        orcamentos
      );

      setRecomendacoes(recomendacoesIA);

      // Aplicar ajustes recomendados
      const novosOrcamentos = await ajustarOrcamentos(totalReceitas, totalDespesas, totalOrcado);
      
      // Atualizar orçamentos no banco de dados
      for (const orcamento of novosOrcamentos) {
        await supabase
          .from('budgets')
          .update({
            allocated_amount: orcamento.allocated_amount,
            status: 'ajustado',
            updated_at: new Date().toISOString()
          })
          .eq('id', orcamento.id);
      }

      await carregarDados();
    } catch (error) {
      console.error('Erro ao ajustar orçamentos:', error);
    } finally {
      setAjustando(false);
    }
  }

  async function ajustarOrcamentos(totalReceitas: number, totalDespesas: number, totalOrcado: number): Promise<Orcamento[]> {
    const fatorAjuste = totalReceitas / totalOrcado;
    
    return orcamentos.map(orcamento => {
      let novoValor = orcamento.allocated_amount;

      // Ajustar baseado na prioridade
      if (orcamento.priority === 'alta') {
        // Manter ou aumentar levemente orçamentos de alta prioridade
        novoValor = Math.min(orcamento.allocated_amount * 1.1, orcamento.allocated_amount * fatorAjuste);
      } else if (orcamento.priority === 'baixa') {
        // Reduzir mais significativamente orçamentos de baixa prioridade
        novoValor = orcamento.allocated_amount * Math.min(fatorAjuste, 0.8);
      } else {
        // Ajuste moderado para prioridade média
        novoValor = orcamento.allocated_amount * fatorAjuste;
      }

      return {
        ...orcamento,
        allocated_amount: Math.round(novoValor * 100) / 100
      };
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ajustes Dinâmicos de Orçamento</h1>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total de Receitas</h2>
          <p className="text-2xl font-bold text-green-600">
            R$ {receitas.reduce((acc, r) => acc + r.amount, 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Despesas Recentes (30 dias)</h2>
          <p className="text-2xl font-bold text-red-600">
            R$ {transacoes
              .filter(t => new Date(t.date) >= new Date(new Date().setDate(new Date().getDate() - 30)))
              .reduce((acc, t) => acc + t.amount, 0)
              .toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Orçado</h2>
          <p className="text-2xl font-bold text-blue-600">
            R$ {orcamentos.reduce((acc, o) => acc + o.allocated_amount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Botão de Análise */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Análise e Ajustes</h2>
          <button
            onClick={analisarMudancas}
            disabled={ajustando}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {ajustando ? 'Analisando...' : 'Analisar e Ajustar'}
          </button>
        </div>

        {recomendacoes && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Recomendações da IA:</h3>
            <div className="prose max-w-none">
              {recomendacoes.split('\n').map((linha, index) => (
                <p key={index} className="mb-2">{linha}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Orçamentos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Orçamentos Atuais</h2>
        <div className="space-y-4">
          {orcamentos.map((orcamento) => (
            <div key={orcamento.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{orcamento.category}</h3>
                  <p className="text-sm text-gray-600">
                    Prioridade: {orcamento.priority} | Status: {orcamento.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    R$ {orcamento.allocated_amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Gasto: R$ {orcamento.spent_amount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    orcamento.spent_amount / orcamento.allocated_amount > 0.9
                      ? 'bg-red-600'
                      : orcamento.spent_amount / orcamento.allocated_amount > 0.7
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  }`}
                  style={{
                    width: `${Math.min(
                      (orcamento.spent_amount / orcamento.allocated_amount) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 