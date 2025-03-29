'use client';

import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function InventarioPage() {
  const { products } = useStore();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventario</h1>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Punto de Reorden</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id.slice(0, 8)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell
                  className={`text-right ${product.stock <= product.reorderPoint ? 'text-red-600 font-bold' : ''}`}
                >
                  {product.stock}
                </TableCell>
                <TableCell className="text-right">{product.reorderPoint}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}