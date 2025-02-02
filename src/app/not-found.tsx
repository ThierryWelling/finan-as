import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="text-gray-600 mb-8">
        Desculpe, a página que você está procurando não existe.
      </p>
      <Link
        href="/"
        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
} 