'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getFinancialRecommendations } from '@/lib/google-ai';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
  status: 'novo' | 'lido' | 'arquivado';
  priority: 'baixa' | 'média' | 'alta';
  created_at: string;
  updated_at: string;
}

interface CreateAlertDTO {
  title: string;
  message: string;
  type: Alert['type'];
  status: Alert['status'];
  priority: Alert['priority'];
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alert[]>([]);
  const [novoAlerta, setNovoAlerta] = useState<CreateAlertDTO>({
    title: '',
    message: '',
    type: 'info',
    status: 'novo',
    priority: 'média'
  });

  useEffect(() => {
    carregarAlertas();
  }, []);

  async function carregarAlertas() {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlertas(data || []);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  }

  async function adicionarAlerta(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('alerts')
        .insert([novoAlerta])
        .select();

      if (error) throw error;

      await carregarAlertas();
      setNovoAlerta({
        title: '',
        message: '',
        type: 'info',
        status: 'novo',
        priority: 'média'
      });
    } catch (error) {
      console.error('Erro ao adicionar alerta:', error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Alertas</h1>

      {/* Formulário de Novo Alerta */}
      <form onSubmit={adicionarAlerta} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={novoAlerta.title}
              onChange={(e) => setNovoAlerta({ ...novoAlerta, title: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              value={novoAlerta.message}
              onChange={(e) => setNovoAlerta({ ...novoAlerta, message: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={novoAlerta.type}
              onChange={(e) => setNovoAlerta({ ...novoAlerta, type: e.target.value as Alert['type'] })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="info">Informação</option>
              <option value="warning">Aviso</option>
              <option value="danger">Perigo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>
            <select
              value={novoAlerta.priority}
              onChange={(e) => setNovoAlerta({ ...novoAlerta, priority: e.target.value as Alert['priority'] })}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Adicionar Alerta
        </button>
      </form>

      {/* Lista de Alertas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
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
            {alertas.map((alerta) => (
              <tr key={alerta.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {alerta.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {alerta.message}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${alerta.type === 'info' ? 'bg-blue-100 text-blue-800' : 
                      alerta.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {alerta.type === 'info' ? 'Informação' : 
                     alerta.type === 'warning' ? 'Aviso' : 'Perigo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${alerta.priority === 'baixa' ? 'bg-green-100 text-green-800' : 
                      alerta.priority === 'média' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {alerta.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${alerta.status === 'novo' ? 'bg-blue-100 text-blue-800' : 
                      alerta.status === 'lido' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {alerta.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(alerta.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 