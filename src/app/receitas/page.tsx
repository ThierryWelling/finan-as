'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Income, CreateIncomeDTO } from '@/types/income';

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Income[]>([]);
  const [novaReceita, setNovaReceita] = useState<CreateIncomeDTO>({
    type: 'salário',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    frequency: 'único',
    status: 'pendente'
  });

  useEffect(() => {
    carregarReceitas();
  }, []);

  async function carregarReceitas() {
    try {
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setReceitas(data || []);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    }
  }

  async function adicionarReceita(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Convertendo expectedDate para expected_date
      const { expectedDate, ...rest } = novaReceita as any;
      const dadosParaEnviar = {
        ...rest,
        expected_date: expectedDate,
      };

      const { error } = await supabase
        .from('income')
        .insert([dadosParaEnviar])
        .select();

      if (error) throw error;

      await carregarReceitas();
      setNovaReceita({
        type: 'salário',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        frequency: 'único',
        status: 'pendente'
      });
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Receitas</h1>

      {/* Formulário de Nova Receita */}
      <form onSubmit={adicionarReceita} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={novaReceita.type}
              onChange={(e) => setNovaReceita({ ...novaReceita, type: e.target.value as Income['type'] })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="salário">Salário</option>
              <option value="investimento">Investimento</option>
              <option value="freelance">Freelance</option>
              <option value="aluguel">Aluguel</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <input
              type="number"
              value={novaReceita.amount}
              onChange={(e) => setNovaReceita({ ...novaReceita, amount: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-lg"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={novaReceita.description}
              onChange={(e) => setNovaReceita({ ...novaReceita, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={novaReceita.category || ''}
              onChange={(e) => setNovaReceita({ ...novaReceita, category: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={novaReceita.date}
              onChange={(e) => setNovaReceita({ ...novaReceita, date: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Esperada
            </label>
            <input
              type="date"
              value={novaReceita.expected_date || ''}
              onChange={(e) => setNovaReceita({ ...novaReceita, expected_date: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência
            </label>
            <select
              value={novaReceita.frequency}
              onChange={(e) => setNovaReceita({ ...novaReceita, frequency: e.target.value as Income['frequency'] })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="único">Único</option>
              <option value="mensal">Mensal</option>
              <option value="semanal">Semanal</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={novaReceita.status}
              onChange={(e) => setNovaReceita({ ...novaReceita, status: e.target.value as Income['status'] })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="pendente">Pendente</option>
              <option value="recebido">Recebido</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Adicionar Receita
        </button>
      </form>

      {/* Lista de Receitas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receitas.map((receita) => (
              <tr key={receita.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{receita.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    R$ {receita.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{receita.description}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {new Date(receita.date).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${receita.status === 'recebido' ? 'bg-green-100 text-green-800' : 
                      receita.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {receita.status}
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