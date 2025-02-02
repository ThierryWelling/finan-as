'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Adicionar a declaração de tipos para o autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DadosFinanceiros {
  receitas: {
    total: number;
    porTipo: { [key: string]: number };
    historico: { data: string; valor: number }[];
  };
  despesas: {
    total: number;
    porCategoria: { [key: string]: number };
    historico: { data: string; valor: number }[];
  };
  investimentos: {
    total: number;
    porTipo: { [key: string]: number };
  };
  objetivos: {
    quantidade: number;
    progresso: { titulo: string; atual: number; alvo: number }[];
  };
}

export default function Dashboard() {
  const [dados, setDados] = useState<DadosFinanceiros | null>(null);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [periodoSelecionado]);

  async function carregarDados() {
    setLoading(true);
    try {
      const dataInicial = new Date();
      dataInicial.setDate(dataInicial.getDate() - parseInt(periodoSelecionado));

      // Carregar receitas
      const { data: receitas } = await supabase
        .from('income')
        .select('*')
        .gte('created_at', dataInicial.toISOString());

      // Carregar despesas
      const { data: despesas } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', dataInicial.toISOString());

      // Carregar objetivos
      const { data: objetivos } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('status', 'active');

      if (receitas && despesas && objetivos) {
        const dadosProcessados = processarDados(receitas, despesas, objetivos);
        setDados(dadosProcessados);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  }

  function processarDados(receitas: any[], despesas: any[], objetivos: any[]): DadosFinanceiros {
    // Processar receitas
    const receitasProcessadas = {
      total: receitas.reduce((acc, r) => acc + r.amount, 0),
      porTipo: receitas.reduce((acc: { [key: string]: number }, r) => {
        acc[r.type] = (acc[r.type] || 0) + r.amount;
        return acc;
      }, {}),
      historico: agruparPorData(receitas)
    };

    // Processar despesas
    const despesasProcessadas = {
      total: despesas.reduce((acc, d) => acc + d.amount, 0),
      porCategoria: despesas.reduce((acc: { [key: string]: number }, d) => {
        acc[d.category] = (acc[d.category] || 0) + d.amount;
        return acc;
      }, {}),
      historico: agruparPorData(despesas)
    };

    // Processar investimentos
    const investimentos = despesas.filter(d => d.category === 'investimento');
    const investimentosProcessados = {
      total: investimentos.reduce((acc, i) => acc + i.amount, 0),
      porTipo: investimentos.reduce((acc: { [key: string]: number }, i) => {
        acc[i.subcategory || 'Outros'] = (acc[i.subcategory || 'Outros'] || 0) + i.amount;
        return acc;
      }, {})
    };

    // Processar objetivos
    const objetivosProcessados = {
      quantidade: objetivos.length,
      progresso: objetivos.map(o => ({
        titulo: o.title,
        atual: o.current_amount,
        alvo: o.target_amount
      }))
    };

    return {
      receitas: receitasProcessadas,
      despesas: despesasProcessadas,
      investimentos: investimentosProcessados,
      objetivos: objetivosProcessados
    };
  }

  function agruparPorData(items: any[]): { data: string; valor: number }[] {
    const agrupado = items.reduce((acc: { [key: string]: number }, item) => {
      const data = new Date(item.date || item.created_at).toISOString().split('T')[0];
      acc[data] = (acc[data] || 0) + item.amount;
      return acc;
    }, {});

    return Object.entries(agrupado)
      .map(([data, valor]) => ({ data, valor }))
      .sort((a, b) => a.data.localeCompare(b.data));
  }

  function exportarParaExcel() {
    if (!dados) return;

    const workbook = XLSX.utils.book_new();

    // Planilha de Resumo
    const resumo = [
      ['Resumo Financeiro'],
      ['Total de Receitas', dados.receitas.total],
      ['Total de Despesas', dados.despesas.total],
      ['Total Investido', dados.investimentos.total],
      ['Saldo', dados.receitas.total - dados.despesas.total],
      [],
      ['Objetivos Financeiros'],
      ['Objetivo', 'Progresso', 'Meta'],
      ...dados.objetivos.progresso.map(o => [
        o.titulo,
        o.atual,
        o.alvo
      ])
    ];

    // Planilha de Receitas
    const receitas = [
      ['Receitas por Tipo'],
      ['Tipo', 'Valor'],
      ...Object.entries(dados.receitas.porTipo)
    ];

    // Planilha de Despesas
    const despesas = [
      ['Despesas por Categoria'],
      ['Categoria', 'Valor'],
      ...Object.entries(dados.despesas.porCategoria)
    ];

    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(resumo), 'Resumo');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(receitas), 'Receitas');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(despesas), 'Despesas');

    XLSX.writeFile(workbook, 'relatorio-financeiro.xlsx');
  }

  function exportarParaPDF() {
    if (!dados) return;

    const doc = new jsPDF();
    let y = 20;

    // Título
    doc.setFontSize(16);
    doc.text('Relatório Financeiro', 105, y, { align: 'center' });
    y += 20;

    // Resumo
    doc.setFontSize(14);
    doc.text('Resumo', 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.autoTable({
      startY: y,
      head: [['Item', 'Valor']],
      body: [
        ['Total de Receitas', `R$ ${dados.receitas.total.toFixed(2)}`],
        ['Total de Despesas', `R$ ${dados.despesas.total.toFixed(2)}`],
        ['Total Investido', `R$ ${dados.investimentos.total.toFixed(2)}`],
        ['Saldo', `R$ ${(dados.receitas.total - dados.despesas.total).toFixed(2)}`]
      ]
    });

    y = (doc as any).lastAutoTable.finalY + 20;

    // Objetivos
    doc.setFontSize(14);
    doc.text('Objetivos Financeiros', 20, y);
    y += 10;

    doc.autoTable({
      startY: y,
      head: [['Objetivo', 'Progresso', 'Meta']],
      body: dados.objetivos.progresso.map(o => [
        o.titulo,
        `R$ ${o.atual.toFixed(2)}`,
        `R$ ${o.alvo.toFixed(2)}`
      ])
    });

    doc.save('relatorio-financeiro.pdf');
  }

  if (loading || !dados) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carregando dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        <div className="flex space-x-4">
          <select
            value={periodoSelecionado}
            onChange={(e) => setPeriodoSelecionado(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="180">Últimos 180 dias</option>
            <option value="365">Último ano</option>
          </select>
          <button
            onClick={exportarParaExcel}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Exportar Excel
          </button>
          <button
            onClick={exportarParaPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total de Receitas</h2>
          <p className="text-2xl font-bold text-green-600">
            R$ {dados.receitas.total.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total de Despesas</h2>
          <p className="text-2xl font-bold text-red-600">
            R$ {dados.despesas.total.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Investido</h2>
          <p className="text-2xl font-bold text-blue-600">
            R$ {dados.investimentos.total.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Saldo</h2>
          <p className={`text-2xl font-bold ${
            dados.receitas.total - dados.despesas.total >= 0
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            R$ {(dados.receitas.total - dados.despesas.total).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Evolução Receitas x Despesas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Evolução Financeira</h2>
          <Line
            data={{
              labels: dados.receitas.historico.map(h => new Date(h.data).toLocaleDateString()),
              datasets: [
                {
                  label: 'Receitas',
                  data: dados.receitas.historico.map(h => h.valor),
                  borderColor: 'rgb(34, 197, 94)',
                  tension: 0.1
                },
                {
                  label: 'Despesas',
                  data: dados.despesas.historico.map(h => h.valor),
                  borderColor: 'rgb(239, 68, 68)',
                  tension: 0.1
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                }
              }
            }}
          />
        </div>

        {/* Distribuição de Despesas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Distribuição de Despesas</h2>
          <Pie
            data={{
              labels: Object.keys(dados.despesas.porCategoria),
              datasets: [
                {
                  data: Object.values(dados.despesas.porCategoria),
                  backgroundColor: [
                    'rgb(239, 68, 68)',
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(168, 85, 247)',
                    'rgb(234, 179, 8)'
                  ]
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right' as const,
                }
              }
            }}
          />
        </div>

        {/* Composição de Investimentos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Composição de Investimentos</h2>
          <Bar
            data={{
              labels: Object.keys(dados.investimentos.porTipo),
              datasets: [
                {
                  label: 'Valor Investido',
                  data: Object.values(dados.investimentos.porTipo),
                  backgroundColor: 'rgb(59, 130, 246)'
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                }
              }
            }}
          />
        </div>

        {/* Progresso dos Objetivos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Progresso dos Objetivos</h2>
          <Bar
            data={{
              labels: dados.objetivos.progresso.map(o => o.titulo),
              datasets: [
                {
                  label: 'Progresso',
                  data: dados.objetivos.progresso.map(o => o.atual),
                  backgroundColor: 'rgb(34, 197, 94)'
                },
                {
                  label: 'Meta',
                  data: dados.objetivos.progresso.map(o => o.alvo),
                  backgroundColor: 'rgb(209, 213, 219)'
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                }
              },
              scales: {
                x: {
                  stacked: false
                },
                y: {
                  stacked: false
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 