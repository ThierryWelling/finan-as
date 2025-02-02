import Link from 'next/link';

export const metadata = {
  title: 'Finanças IA - Início',
  description: 'Sua plataforma inteligente para gestão financeira pessoal',
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Finanças IA</h1>
        <p className="text-xl text-gray-600">
          Sua plataforma inteligente para gestão financeira pessoal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Gestão Inteligente</h2>
          <p className="text-gray-600">
            Nossa IA analisa seus gastos e receitas para fornecer recomendações personalizadas
            e ajudar você a atingir seus objetivos financeiros.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controle Total</h2>
          <p className="text-gray-600">
            Acompanhe suas despesas, receitas e investimentos em um só lugar.
            Visualize relatórios detalhados e tome decisões informadas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Realize seus Sonhos</h2>
          <p className="text-gray-600">
            Defina objetivos financeiros e acompanhe seu progresso.
            Nossa IA ajuda você a criar estratégias para alcançá-los mais rápido.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/dashboard"
          className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700"
        >
          Começar Agora
        </Link>
      </div>
    </div>
  );
} 