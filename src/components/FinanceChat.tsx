'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { getAIClassification } from '@/lib/google-ai';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface FinancialData {
  transactions: any[];
  income: any[];
  goals: any[];
  budgets: any[];
}

export default function FinanceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou sua assistente financeira. Posso ajudar você a entender seus dados financeiros, gastos, receitas, objetivos e orçamentos. O que gostaria de saber?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadFinancialData = async (): Promise<FinancialData> => {
    const dataInicial = new Date();
    dataInicial.setDate(dataInicial.getDate() - 30); // Últimos 30 dias

    // Carregar transações
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', dataInicial.toISOString());

    // Carregar receitas
    const { data: income } = await supabase
      .from('income')
      .select('*')
      .gte('date', dataInicial.toISOString());

    // Carregar objetivos
    const { data: goals } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('status', 'active');

    // Carregar orçamentos
    const { data: budgets } = await supabase
      .from('budgets')
      .select('*')
      .eq('status', 'active');

    return {
      transactions: transactions || [],
      income: income || [],
      goals: goals || [],
      budgets: budgets || []
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Carregar dados financeiros do cliente
      const financialData = await loadFinancialData();

      const prompt = `
        Como assistente financeiro, analise os dados financeiros do cliente e responda à pergunta:
        "${inputMessage}"

        Dados financeiros do cliente:
        - Transações recentes: ${JSON.stringify(financialData.transactions)}
        - Receitas recentes: ${JSON.stringify(financialData.income)}
        - Objetivos financeiros: ${JSON.stringify(financialData.goals)}
        - Orçamentos: ${JSON.stringify(financialData.budgets)}

        Forneça uma resposta personalizada baseada APENAS nos dados acima, incluindo:
        1. Análise específica dos dados do cliente
        2. Números e valores reais das transações/receitas
        3. Progresso em relação aos objetivos
        4. Situação dos orçamentos
        
        Responda em português do Brasil, de forma clara e objetiva, mantendo um tom profissional mas amigável.
        Se a pergunta não puder ser respondida com os dados disponíveis, informe isso ao usuário.
      `;

      const aiResponse = await getAIClassification(prompt);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao obter resposta da IA:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
      >
        <ChatBubbleLeftIcon className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-emerald-600 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold">Assistente Financeiro</h3>
            <p className="text-sm text-emerald-100">Tire suas dúvidas sobre seus dados financeiros</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs mt-1 block opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pergunte sobre seus dados financeiros..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            {isLoading && (
              <p className="text-xs text-gray-500 mt-2">Analisando seus dados financeiros...</p>
            )}
          </form>
        </div>
      )}
    </>
  );
} 