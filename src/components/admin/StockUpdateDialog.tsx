import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Minus } from 'lucide-react';
import type { Product } from '@/hooks/useProducts';

interface StockUpdateDialogProps {
  product: Product;
  onUpdate: (newStock: number) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const StockUpdateDialog = ({ product, onUpdate, onCancel, isSubmitting }: StockUpdateDialogProps) => {
  const [stockChange, setStockChange] = useState(0);
  const [changeType, setChangeType] = useState<'add' | 'subtract' | 'set'>('add');

  const calculateNewStock = () => {
    switch (changeType) {
      case 'add':
        return product.stock_quantity + stockChange;
      case 'subtract':
        return Math.max(0, product.stock_quantity - stockChange);
      case 'set':
        return stockChange;
      default:
        return product.stock_quantity;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(calculateNewStock());
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-sm w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground">Update Stock</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="font-medium text-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Current stock: <span className="font-medium text-foreground">{product.stock_quantity}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Update Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={changeType === 'add' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChangeType('add')}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                type="button"
                variant={changeType === 'subtract' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChangeType('subtract')}
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <Button
                type="button"
                variant={changeType === 'set' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChangeType('set')}
                className="flex-1"
              >
                Set
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {changeType === 'set' ? 'New Stock Quantity' : 'Quantity'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={stockChange}
              onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="p-3 bg-secondary rounded-sm">
            <p className="text-sm text-muted-foreground">New stock will be:</p>
            <p className="text-xl font-bold text-foreground">{calculateNewStock()}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockUpdateDialog;
