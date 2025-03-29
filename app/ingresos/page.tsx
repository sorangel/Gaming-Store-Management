'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const paymentMethods = [
  'Efectivo',
  'Tarjeta de Débito',
  'Tarjeta de Crédito',
  'Transferencia',
  'Mercado Pago',
];

const incomeCategories = [
  'Venta de Juegos',
  'Alquiler de Consolas',
  'Accesorios',
  'Reparaciones',
  'Otros',
];

export default function IngresosPage() {
  const { transactions, products, addTransaction } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: 'all',
    paymentMethod: 'all',
  });

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    description: '',
    quantity: '1',
    unitPrice: '',
    unitPriceUSD: '',
    paymentMethod: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction = {
      id: crypto.randomUUID(),
      date: formData.date,
      type: 'income' as const,
      amount: parseFloat(formData.unitPrice) * parseInt(formData.quantity),
      amountUSD: parseFloat(formData.unitPriceUSD) * parseInt(formData.quantity),
      category: formData.category,
      description: formData.description,
      paymentMethod: formData.paymentMethod,
      quantity: parseInt(formData.quantity),
    };

    addTransaction(transaction);
    setIsOpen(false);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      category: '',
      description: '',
      quantity: '1',
      unitPrice: '',
      unitPriceUSD: '',
      paymentMethod: '',
    });
  };

  const filteredTransactions = transactions
    .filter((t) => t.type === 'income')
    .filter((t) => {
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.paymentMethod !== 'all' && t.paymentMethod !== filters.paymentMethod)
        return false;
      return true;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const totalIncome = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncomeUSD = filteredTransactions.reduce((sum, t) => sum + (t.amountUSD || t.amount / 100), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Registro de Ingresos</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingreso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Ingreso</DialogTitle>
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
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Precio Unitario (Bs)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => {
                      const bsPrice = e.target.value;
                      setFormData({
                        ...formData,
                        unitPrice: bsPrice,
                        unitPriceUSD: (parseFloat(bsPrice) / 100).toString()
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPriceUSD">Precio Unitario (USD)</Label>
                  <Input
                    id="unitPriceUSD"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPriceUSD}
                    onChange={(e) => {
                      const usdPrice = e.target.value;
                      setFormData({
                        ...formData,
                        unitPriceUSD: usdPrice,
                        unitPrice: (parseFloat(usdPrice) * 100).toString()
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Forma de Pago</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Registrar Ingreso
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="dateFrom">Desde</Label>
            <Input
              type="date"
              id="dateFrom"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="dateTo">Hasta</Label>
            <Input
              type="date"
              id="dateTo"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
          <div>
            <Label>Categoría</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {incomeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Método de Pago</Label>
            <Select
              value={filters.paymentMethod}
              onValueChange={(value) =>
                setFilters({ ...filters, paymentMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los métodos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Total de Ingresos (Bs)</h2>
          <p className="text-3xl font-bold text-green-600">
            Bs. {totalIncome.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Total de Ingresos (USD)</h2>
          <p className="text-3xl font-bold text-green-600">
            $ {totalIncomeUSD.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Precio Unit. (Bs)</TableHead>
              <TableHead className="text-right">Precio Unit. (USD)</TableHead>
              <TableHead className="text-right">Total (Bs)</TableHead>
              <TableHead className="text-right">Total (USD)</TableHead>
              <TableHead>Método de Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-right">{transaction.quantity}</TableCell>
                <TableCell className="text-right">
                  Bs. {(transaction.amount / transaction.quantity).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  $ {((transaction.amountUSD || transaction.amount / 100) / transaction.quantity).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  Bs. {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  $ {(transaction.amountUSD || transaction.amount / 100).toFixed(2)}
                </TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}