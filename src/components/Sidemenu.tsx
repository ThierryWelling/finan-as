'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartPieIcon,
  ClockIcon,
  CogIcon,
  BellIcon,
  LightBulbIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
  { name: 'Transações', path: '/transacoes', icon: CreditCardIcon },
  { name: 'Receitas', path: '/receitas', icon: BanknotesIcon },
  { name: 'Planejamento', path: '/planejamento', icon: ChartPieIcon },
  { name: 'Histórico', path: '/relevancia', icon: ClockIcon },
  { name: 'Sugestões', path: '/sugestoes', icon: LightBulbIcon },
  { name: 'Alertas', path: '/alertas', icon: BellIcon },
  { name: 'Ajustes', path: '/ajustes', icon: CogIcon },
];

export default function Sidemenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {!isCollapsed && (
            <Link href="/" className="text-xl font-semibold text-gray-800">
              Finanças IA
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ArrowRightIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {!isCollapsed && (
                      <span className={`ml-3 ${
                        isActive ? 'font-medium' : ''
                      }`}>
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Usuário</p>
                <p className="text-xs text-gray-500">usuario@email.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 