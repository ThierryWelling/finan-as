import Link from 'next/link';

export const metadata = {
  title: 'Finanças IA - Início',
  description: 'Sua plataforma inteligente para gestão financeira pessoal',
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Finanças IA</h1>
      <p className="text-xl text-gray-600">
        Sua plataforma inteligente para gestão financeira pessoal
      </p>
    </div>
  );
} 