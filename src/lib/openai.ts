import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env.OPENAI_API_KEY');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getFinancialRecommendations(
  transactions: any[],
  goals: any[],
  budgets: any[]
) {
  const prompt = `
    Analise os seguintes dados financeiros e forneça recomendações:
    Transações: ${JSON.stringify(transactions)}
    Objetivos: ${JSON.stringify(goals)}
    Orçamentos: ${JSON.stringify(budgets)}
    
    Forneça recomendações específicas para melhorar a saúde financeira.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Você é um consultor financeiro especializado em análise de dados e recomendações personalizadas."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
} 