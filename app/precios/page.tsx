'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/store';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function PreciosPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    priceUSD: '',
    cost: '',
    costUSD: '',
    stock: '',
    reorderPoint: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      id: editingProduct?.id || crypto.randomUUID(),
      name: formData.name,
      price: parseFloat(formData.price),
      priceUSD: parseFloat(formData.price) / 100,
      cost: parseFloat(formData.cost),
      costUSD: parseFloat(formData.cost) / 100,
      stock: parseInt(formData.stock),
      reorderPoint: parseInt(formData.reorderPoint),
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setIsOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      priceUSD: '',
      cost: '',
      costUSD: '',
      stock: '',
      reorderPoint: '',
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: (product.price).toString(),
      priceUSD: (product.price / 100).toString(),
      cost: (product.cost).toString(),
      costUSD: (product.cost / 100).toString(),
      stock: product.stock.toString(),
      reorderPoint: product.reorderPoint.toString(),
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lista de Precios</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio de Venta (Bs)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => {
                    const bsPrice = e.target.value;
                    setFormData({
                      ...formData,
                      price: bsPrice,
                      priceUSD: (parseFloat(bsPrice) / 100).toString()
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceUSD">Precio de Venta (USD)</Label>
                <Input
                  id="priceUSD"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceUSD}
                  onChange={(e) => {
                    const usdPrice = e.target.value;
                    setFormData({
                      ...formData,
                      priceUSD: usdPrice,
                      price: (parseFloat(usdPrice) * 100).toString()
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Costo (Bs)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => {
                    const bsCost = e.target.value;
                    setFormData({
                      ...formData,
                      cost: bsCost,
                      costUSD: (parseFloat(bsCost) / 100).toString()
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costUSD">Costo (USD)</Label>
                <Input
                  id="costUSD"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costUSD}
                  onChange={(e) => {
                    const usdCost = e.target.value;
                    setFormData({
                      ...formData,
                      costUSD: usdCost,
                      cost: (parseFloat(usdCost) * 100).toString()
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Actual</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderPoint">Punto de Reorden</Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  min="0"
                  value={formData.reorderPoint}
                  onChange={(e) =>
                    setFormData({ ...formData, reorderPoint: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Precio (Bs)</TableHead>
              <TableHead className="text-right">Precio (USD)</TableHead>
              <TableHead className="text-right">Costo (Bs)</TableHead>
              <TableHead className="text-right">Costo (USD)</TableHead>
              <TableHead className="text-right">Margen</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Punto de Reorden</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-right">Bs. {product.price}</TableCell>
                <TableCell className="text-right">$ {product.priceUSD}</TableCell>
                <TableCell className="text-right">Bs. {product.cost}</TableCell>
                <TableCell className="text-right">$ {product.costUSD}</TableCell>
                <TableCell className="text-right">
                  {(((product.price - product.cost) / product.price) * 100).toFixed(
                    1
                  )}
                  %
                </TableCell>
                <TableCell
                  className={`text-right ${
                    product.stock <= product.reorderPoint
                      ? 'text-red-600 font-bold'
                      : ''
                  }`}
                >
                  {product.stock}
                </TableCell>
                <TableCell className="text-right">{product.reorderPoint}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}