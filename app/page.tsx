import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  Package,
  PieChart,
  Tags,
} from 'lucide-react';

const features = [
  {
    name: 'Dashboard',
    description: 'Vista general del negocio',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Precios',
    description: 'Gestión de productos y servicios',
    href: '/precios',
    icon: Tags,
  },
  {
    name: 'Ingresos',
    description: 'Registro de ventas y pagos',
    href: '/ingresos',
    icon: DollarSign,
  },
  {
    name: 'Gastos',
    description: 'Control de egresos',
    href: '/gastos',
    icon: CreditCard,
  },
  {
    name: 'Inventario',
    description: 'Control de stock',
    href: '/inventario',
    icon: Package,
  },
  {
    name: 'Análisis',
    description: 'Reportes y estadísticas',
    href: '/analisis',
    icon: PieChart,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Gaming Store Management
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Sistema integral para la gestión de tu tienda de videojuegos
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.name} className="p-6">
            <feature.icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">{feature.name}</h2>
            <p className="mt-2 text-gray-600">{feature.description}</p>
            <Button asChild className="mt-4 w-full">
              <Link href={feature.href}>Acceder</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}