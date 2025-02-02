import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_GOOGLE_AI_API_KEY');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function getFinancialRecommendations(
  transactions: any[],
  goals: any[],
  budgets: any[]
): Promise<string> {
  try {
    const prompt = `
      Analise os seguintes dados financeiros e forneça recomendações personalizadas:
      
      Transações: ${JSON.stringify(transactions)}
      Objetivos: ${JSON.stringify(goals)}
      Orçamentos: ${JSON.stringify(budgets)}
      
      Por favor, forneça:
      1. Análise dos padrões de gastos
      2. Sugestões para economia
      3. Recomendações para atingir os objetivos financeiros
      4. Alertas sobre possíveis problemas
      
      Responda em português do Brasil, de forma clara e objetiva.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    return 'Não foi possível gerar recomendações no momento. Tente novamente mais tarde.';
  }
}

export async function getAIClassification(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Erro na classificação com IA:', error);
    throw error;
  }
} 