'use client';

import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { transactions } = useStore();

  // Calculate KPIs
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Prepare chart data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  const chartData = last30Days.map((date) => {
    const dayIncome = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(date))
      .reduce((sum, t) => sum + t.amount, 0);

    const dayExpenses = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(date))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: format(new Date(date), 'dd/MM'),
      income: dayIncome,
      expenses: dayExpenses,
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Gastos Totales</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Ganancia Neta</h3>
          <p
            className={`mt-2 text-3xl font-bold ${
              netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ${netProfit.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Ingresos vs Gastos (30 días)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" name="Ingresos" fill="hsl(var(--chart-1))" />
              <Bar dataKey="expenses" name="Gastos" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}