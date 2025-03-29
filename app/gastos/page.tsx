'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';

export default function GastosPage() {
  const { transactions, addTransaction, deleteTransaction } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    proveedor: '',
    montoMin: '',
    montoMax: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    amountUSD: '',
    description: '',
    invoice: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction = {
      id: crypto.randomUUID(),
      date: formData.date,
      type: 'expense' as const,
      amount: parseFloat(formData.amount),
      amountUSD: parseFloat(formData.amount) / 100,
      category: formData.category,
      description: formData.description,
      exchangeRate: 100,
    };

    addTransaction(transaction);
    setIsOpen(false);
    setFormData({
      date: '',
      category: '',
      amount: '',
      amountUSD: '',
      description: '',
      invoice: '',
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    
    const matchesProveedor = !filters.proveedor || 
      t.description.toLowerCase().includes(filters.proveedor.toLowerCase());
    
    const matchesMontoMin = !filters.montoMin || 
      t.amount >= parseFloat(filters.montoMin);
    
    const matchesMontoMax = !filters.montoMax || 
      t.amount <= parseFloat(filters.montoMax);
    
    const matchesFechaInicio = !filters.fechaInicio || 
      t.date >= filters.fechaInicio;
    
    const matchesFechaFin = !filters.fechaFin || 
      t.date <= filters.fechaFin;

    return matchesProveedor && matchesMontoMin && matchesMontoMax && 
           matchesFechaInicio && matchesFechaFin;
  });

  const totalExpenses = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpensesUSD = filteredTransactions.reduce((sum, t) => sum + t.amountUSD, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncomeUSD = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount / 100), 0);

  const netProfit = totalIncome - totalExpenses;
  const netProfitUSD = totalIncomeUSD - totalExpensesUSD;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🛒 Registro de Gastos</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Gasto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto (Bs)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    const bsAmount = e.target.value;
                    setFormData({
                      ...formData,
                      amount: bsAmount,
                      amountUSD: (parseFloat(bsAmount) / 100).toString()
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amountUSD">Monto (USD)</Label>
                <Input
                  id="amountUSD"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amountUSD}
                  onChange={(e) => {
                    const usdAmount = e.target.value;
                    setFormData({
                      ...formData,
                      amountUSD: usdAmount,
                      amount: (parseFloat(usdAmount) * 100).toString()
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Proveedor/Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice">Factura</Label>
                <Input
                  id="invoice"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFormData({ ...formData, invoice: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Registrar Gasto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Ingresos Totales</h3>
          <p className="text-2xl font-bold text-green-600">Bs. {totalIncome.toFixed(2)}</p>
          <p className="text-lg text-green-600">$ {totalIncomeUSD.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Gastos Totales</h3>
          <p className="text-2xl font-bold text-red-600">Bs. {totalExpenses.toFixed(2)}</p>
          <p className="text-lg text-red-600">$ {totalExpensesUSD.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Ganancia Neta</h3>
          <p className="text-2xl font-bold text-blue-600">Bs. {netProfit.toFixed(2)}</p>
          <p className="text-lg text-blue-600">$ {netProfitUSD.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Filtros</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="proveedor">Proveedor</Label>
              <Input
                id="proveedor"
                value={filters.proveedor}
                onChange={(e) =>
                  setFilters({ ...filters, proveedor: e.target.value })
                }
                placeholder="Buscar por proveedor..."
              />
            </div>
            <div>
              <Label htmlFor="montoMin">Monto Mínimo</Label>
              <Input
                id="montoMin"
                type="number"
                min="0"
                step="0.01"
                value={filters.montoMin}
                onChange={(e) =>
                  setFilters({ ...filters, montoMin: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="montoMax">Monto Máximo</Label>
              <Input
                id="montoMax"
                type="number"
                min="0"
                step="0.01"
                value={filters.montoMax}
                onChange={(e) =>
                  setFilters({ ...filters, montoMax: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={filters.fechaInicio}
                onChange={(e) =>
                  setFilters({ ...filters, fechaInicio: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={filters.fechaFin}
                onChange={(e) =>
                  setFilters({ ...filters, fechaFin: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead className="text-right">Monto (Bs)</TableHead>
                <TableHead className="text-right">Monto (USD)</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right">
                    Bs. {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    $ {transaction.amountUSD.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}