'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'baixo' | 'médio' | 'alto';
  status: 'pendente' | 'implementada' | 'rejeitada';
  created_at: string;
  updated_at: string;
}

interface CreateSuggestionDTO {
  title: string;
  description: string;
  category: string;
  impact: Suggestion['impact'];
  status: Suggestion['status'];
}

export default function SugestoesPage() {
  const [sugestoes, setSugestoes] = useState<Suggestion[]>([]);
  const [novaSugestao, setNovaSugestao] = useState<CreateSuggestionDTO>({
    title: '',
    description: '',
    category: '',
    impact: 'médio',
    status: 'pendente'
  });

  useEffect(() => {
    carregarSugestoes();
  }, []);

  async function carregarSugestoes() {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSugestoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    }
  }

  async function adicionarSugestao(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('suggestions')
        .insert([novaSugestao])
        .select();

      if (error) throw error;

      await carregarSugestoes();
      setNovaSugestao({
        title: '',
        description: '',
        category: '',
        impact: 'médio',
        status: 'pendente'
      });
    } catch (error) {
      console.error('Erro ao adicionar sugestão:', error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sugestões de Melhoria</h1>

      {/* Formulário de Nova Sugestão */}
      <form onSubmit={adicionarSugestao} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={novaSugestao.title}
              onChange={(e) => setNovaSugestao({ ...novaSugestao, title: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={novaSugestao.description}
              onChange={(e) => setNovaSugestao({ ...novaSugestao, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={novaSugestao.category}
              onChange={(e) => setNovaSugestao({ ...novaSugestao, category: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impacto
            </label>
            <select
              value={novaSugestao.impact}
              onChange={(e) => setNovaSugestao({ ...novaSugestao, impact: e.target.value as Suggestion['impact'] })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="baixo">Baixo</option>
              <option value="médio">Médio</option>
              <option value="alto">Alto</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Adicionar Sugestão
        </button>
      </form>

      {/* Lista de Sugestões */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sugestoes.map((sugestao) => (
              <tr key={sugestao.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {sugestao.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sugestao.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{sugestao.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${sugestao.impact === 'baixo' ? 'bg-green-100 text-green-800' : 
                      sugestao.impact === 'médio' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {sugestao.impact}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${sugestao.status === 'implementada' ? 'bg-green-100 text-green-800' : 
                      sugestao.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {sugestao.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sugestao.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 