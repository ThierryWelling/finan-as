'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'entrada' | 'saída';
  category: string;
  date: string;
  payment_method: 'dinheiro' | 'cartão' | 'pix' | 'transferência';
  status: 'concluída' | 'pendente' | 'cancelada';
  created_at: string;
  updated_at: string;
}

interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: Transaction['type'];
  category: string;
  date: string;
  payment_method: Transaction['payment_method'];
  status: Transaction['status'];
}

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [novaTransacao, setNovaTransacao] = useState<CreateTransactionDTO>({
    description: '',
    amount: 0,
    type: 'entrada',
    category: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'pix',
    status: 'pendente'
  });

  useEffect(() => {
    carregarTransacoes();
  }, []);

  async function carregarTransacoes() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransacoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  }

  async function adicionarTransacao(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([novaTransacao])
        .select();

      if (error) throw error;

      await carregarTransacoes();
      setNovaTransacao({
        description: '',
        amount: 0,
        type: 'entrada',
        category: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'pix',
        status: 'pendente'
      });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Transações</h1>

      {/* Formulário de Nova Transação */}
      <form onSubmit={adicionarTransacao} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={novaTransacao.description}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, description: e.target.value })}
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
              value={novaTransacao.amount}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, amount: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-lg"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={novaTransacao.type}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, type: e.target.value as Transaction['type'] })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="entrada">Entrada</option>
              <option value="saída">Saída</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={novaTransacao.category}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, category: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={novaTransacao.date}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, date: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pagamento
            </label>
            <select
              value={novaTransacao.payment_method}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, payment_method: e.target.value as Transaction['payment_method'] })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="cartão">Cartão</option>
              <option value="pix">PIX</option>
              <option value="transferência">Transferência</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={novaTransacao.status}
              onChange={(e) => setNovaTransacao({ ...novaTransacao, status: e.target.value as Transaction['status'] })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="pendente">Pendente</option>
              <option value="concluída">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Adicionar Transação
        </button>
      </form>

      {/* Lista de Transações */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
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
            {transacoes.map((transacao) => (
              <tr key={transacao.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{transacao.description}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    R$ {transacao.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${transacao.type === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {transacao.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{transacao.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {new Date(transacao.date).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${transacao.status === 'concluída' ? 'bg-green-100 text-green-800' : 
                      transacao.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {transacao.status}
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