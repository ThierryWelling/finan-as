import './globals.css';
import { Inter } from 'next/font/google';
import Sidemenu from '@/components/Sidemenu';
import FinanceChat from '@/components/FinanceChat';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Finanças IA',
  description: 'Gestão Inteligente de Finanças Pessoais',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidemenu />
          <main className="flex-1 ml-64 bg-gray-50 p-8">
            {children}
          </main>
          <FinanceChat />
        </div>
      </body>
    </html>
  );
} 