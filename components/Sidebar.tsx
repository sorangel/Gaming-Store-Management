'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  Package,
  PieChart,
  Tags,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Precios', href: '/precios', icon: Tags },
  { name: 'Ingresos', href: '/ingresos', icon: DollarSign },
  { name: 'Gastos', href: '/gastos', icon: CreditCard },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Análisis', href: '/analisis', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-y-5 bg-white px-6 py-4">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-bold">Gaming Store</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-gray-50 text-primary'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-gray-400 group-hover:text-primary',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}