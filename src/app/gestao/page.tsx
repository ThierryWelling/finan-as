'use client';

import { useState } from 'react';
import { Transaction, Budget, FinancialGoal } from '@/types/finances';
import { supabase } from '@/lib/supabase';
import { getFinancialRecommendations } from '@/lib/google-ai';

export default function GestaoFinanceira() {
  const [novoGasto, setNovoGasto] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    data: ''
  });

  const [novoObjetivo, setNovoObjetivo] = useState({
    titulo: '',
    valorAlvo: '',
    prazo: ''
  });

  const [distribuicaoRecursos, setDistribuicaoRecursos] = useState<any>(null);

  async function adicionarGasto(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          description: novoGasto.descricao,
          amount: parseFloat(novoGasto.valor),
          type: 'expense',
          category: novoGasto.categoria,
          date: novoGasto.data,
          userId: 'user_id' // Substituir pelo ID do usuário logado
        }]);

      if (error) throw error;
      setNovoGasto({ descricao: '', valor: '', categoria: '', data: '' });
      await atualizarDistribuicaoRecursos();
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
    }
  }

  async function adicionarObjetivo(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert([{
          title: novoObjetivo.titulo,
          targetAmount: parseFloat(novoObjetivo.valorAlvo),
          currentAmount: 0,
          deadline: novoObjetivo.prazo,
          status: 'active',
          userId: 'user_id' // Substituir pelo ID do usuário logado
        }]);

      if (error) throw error;
      setNovoObjetivo({ titulo: '', valorAlvo: '', prazo: '' });
      await atualizarDistribuicaoRecursos();
    } catch (error) {
      console.error('Erro ao adicionar objetivo:', error);
    }
  }

  async function atualizarDistribuicaoRecursos() {
    try {
      // Buscar dados atualizados
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*');

      const { data: goals } = await supabase
        .from('financial_goals')
        .select('*');

      const { data: budgets } = await supabase
        .from('budgets')
        .select('*');

      // Obter recomendações da IA
      const recomendacoes = await getFinancialRecommendations(
        transactions || [],
        goals || [],
        budgets || []
      );

      setDistribuicaoRecursos(recomendacoes);
    } catch (error) {
      console.error('Erro ao atualizar distribuição:', error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestão Inteligente de Finanças</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Gastos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Registrar Novo Gasto</h2>
          <form onSubmit={adicionarGasto} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <input
                type="text"
                value={novoGasto.descricao}
                onChange={(e) => setNovoGasto({...novoGasto, descricao: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor (R$)</label>
              <input
                type="number"
                value={novoGasto.valor}
                onChange={(e) => setNovoGasto({...novoGasto, valor: e.target.value})}
                className="w-full p-2 border rounded"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select
                value={novoGasto.categoria}
                onChange={(e) => setNovoGasto({...novoGasto, categoria: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="alimentacao">Alimentação</option>
                <option value="transporte">Transporte</option>
                <option value="moradia">Moradia</option>
                <option value="lazer">Lazer</option>
                <option value="saude">Saúde</option>
                <option value="educacao">Educação</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="date"
                value={novoGasto.data}
                onChange={(e) => setNovoGasto({...novoGasto, data: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Registrar Gasto
            </button>
          </form>
        </div>

        {/* Formulário de Objetivos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Definir Novo Objetivo</h2>
          <form onSubmit={adicionarObjetivo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título do Objetivo</label>
              <input
                type="text"
                value={novoObjetivo.titulo}
                onChange={(e) => setNovoObjetivo({...novoObjetivo, titulo: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor Alvo (R$)</label>
              <input
                type="number"
                value={novoObjetivo.valorAlvo}
                onChange={(e) => setNovoObjetivo({...novoObjetivo, valorAlvo: e.target.value})}
                className="w-full p-2 border rounded"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prazo</label>
              <input
                type="date"
                value={novoObjetivo.prazo}
                onChange={(e) => setNovoObjetivo({...novoObjetivo, prazo: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Definir Objetivo
            </button>
          </form>
        </div>
      </div>

      {/* Distribuição Inteligente de Recursos */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Distribuição Inteligente de Recursos</h2>
        <div className="prose max-w-none">
          {distribuicaoRecursos ? (
            <div dangerouslySetInnerHTML={{ __html: distribuicaoRecursos.replace(/\n/g, '<br>') }} />
          ) : (
            <p>Carregando recomendações...</p>
          )}
        </div>
      </div>
    </div>
  );
} 