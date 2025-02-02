'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Budget {
  id: string;
  title: string;
  amount: number;
  category: string;
  start_date: string;
  end_date: string;
  status: 'ativo' | 'concluído' | 'cancelado';
  progress: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CreateBudgetDTO {
  title: string;
  amount: number;
  category: string;
  start_date: string;
  end_date: string;
  status: Budget['status'];
  progress: number;
  description: string;
}

export default function PlanejamentoPage() {
  const [orcamentos, setOrcamentos] = useState<Budget[]>([]);
  const [novoOrcamento, setNovoOrcamento] = useState<CreateBudgetDTO>({
    title: '',
    amount: 0,
    category: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    status: 'ativo',
    progress: 0,
    description: ''
  });

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  async function carregarOrcamentos() {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setOrcamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    }
  }

  async function adicionarOrcamento(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('budgets')
        .insert([novoOrcamento])
        .select();

      if (error) throw error;

      await carregarOrcamentos();
      setNovoOrcamento({
        title: '',
        amount: 0,
        category: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        status: 'ativo',
        progress: 0,
        description: ''
      });
    } catch (error) {
      console.error('Erro ao adicionar orçamento:', error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Planejamento Financeiro</h1>

      {/* Formulário de Novo Orçamento */}
      <form onSubmit={adicionarOrcamento} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={novoOrcamento.title}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, title: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <input
              type="number"
              value={novoOrcamento.amount}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, amount: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-lg"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={novoOrcamento.category}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, category: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={novoOrcamento.start_date}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, start_date: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={novoOrcamento.end_date}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, end_date: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={novoOrcamento.status}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, status: e.target.value as Budget['status'] })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="ativo">Ativo</option>
              <option value="concluído">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progresso (%)
            </label>
            <input
              type="number"
              value={novoOrcamento.progress}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, progress: Math.min(100, Math.max(0, parseInt(e.target.value))) })}
              className="w-full p-2 border rounded-lg"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={novoOrcamento.description}
              onChange={(e) => setNovoOrcamento({ ...novoOrcamento, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Adicionar Orçamento
        </button>
      </form>

      {/* Lista de Orçamentos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progresso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orcamentos.map((orcamento) => (
              <tr key={orcamento.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {orcamento.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {orcamento.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    R$ {orcamento.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{orcamento.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(orcamento.start_date).toLocaleDateString()} -
                    {new Date(orcamento.end_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full"
                      style={{ width: `${orcamento.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{orcamento.progress}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${orcamento.status === 'ativo' ? 'bg-green-100 text-green-800' : 
                      orcamento.status === 'concluído' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {orcamento.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 