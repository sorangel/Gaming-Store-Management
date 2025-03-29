'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AnalisisPage() {
  const { transactions } = useStore();
  const [period, setPeriod] = useState('monthly');

  // Función para calcular datos por período
  const calculatePeriodData = () => {
    const now = new Date();
    let dates: Date[] = [];
    let dateFormat = '';

    switch (period) {
      case 'monthly':
        dates = Array.from({ length: 12 }, (_, i) => subMonths(now, i)).reverse();
        dateFormat = 'MMM yyyy';
        break;
      case 'quarterly':
        dates = Array.from({ length: 8 }, (_, i) => subMonths(now, i * 3)).reverse();
        dateFormat = "'Q'Q yyyy";
        break;
      case 'yearly':
        dates = Array.from({ length: 3 }, (_, i) => subMonths(now, i * 12)).reverse();
        dateFormat = 'yyyy';
        break;
    }

    return dates.map(date => {
      let startDate, endDate;

      if (period === 'monthly') {
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
      } else if (period === 'quarterly') {
        startDate = startOfMonth(date);
        endDate = endOfMonth(subMonths(date, -2));
      } else {
        startDate = startOfMonth(date);
        endDate = endOfMonth(subMonths(date, -11));
      }

      const periodTransactions = transactions.filter(t => {
        const transDate = new Date(t.date);
        return transDate >= startDate && transDate <= endDate;
      });

      const income = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const incomeUSD = income / 100; // Convertir a USD

      const expenses = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const expensesUSD = expenses / 100; // Convertir a USD

      const profit = income - expenses;
      const profitUSD = incomeUSD - expensesUSD;
      const profitMargin = income > 0 ? (profit / income) * 100 : 0;

      return {
        period: format(date, dateFormat, { locale: es }),
        income,
        incomeUSD,
        expenses,
        expensesUSD,
        profit,
        profitUSD,
        profitMargin
      };
    });
  };

  const data = calculatePeriodData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Análisis Financiero</h1>
        <div className="w-48">
          <Label>Período</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gráfico de Ingresos vs Gastos */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Ingresos vs Gastos</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name="Ingresos (Bs)" fill="hsl(var(--chart-1))" />
              <Bar dataKey="incomeUSD" name="Ingresos (USD)" fill="hsl(var(--chart-3))" />
              <Bar dataKey="expenses" name="Gastos (Bs)" fill="hsl(var(--chart-2))" />
              <Bar dataKey="expensesUSD" name="Gastos (USD)" fill="hsl(var(--chart-4))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico de Rentabilidad */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Rentabilidad</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="profit"
                name="Ganancia (Bs)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profitUSD"
                name="Ganancia (USD)"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="profitMargin"
                name="Margen de Ganancia (%)"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}