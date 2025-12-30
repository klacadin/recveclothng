import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Minus } from 'lucide-react';
import type { Product } from '@/hooks/useProducts';
import { type ProductVariant, type ProductSize, type SizeStock, SIZES, variantsToSizeStock } from '@/hooks/useProductVariants';

interface SizeStockUpdateDialogProps {
  product: Product;
  variants: ProductVariant[];
  onUpdate: (sizeStocks: SizeStock) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const SizeStockUpdateDialog = ({ product, variants, onUpdate, onCancel, isSubmitting }: SizeStockUpdateDialogProps) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [stockChange, setStockChange] = useState(0);
  const [changeType, setChangeType] = useState<'add' | 'subtract' | 'set'>('add');
  const [sizeStocks, setSizeStocks] = useState<SizeStock>({ XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 });

  useEffect(() => {
    if (variants.length > 0) {
      setSizeStocks(variantsToSizeStock(variants));
    }
  }, [variants]);

  const getCurrentStock = () => sizeStocks[selectedSize];

  const calculateNewStock = () => {
    const current = getCurrentStock();
    switch (changeType) {
      case 'add':
        return current + stockChange;
      case 'subtract':
        return Math.max(0, current - stockChange);
      case 'set':
        return stockChange;
      default:
        return current;
    }
  };

  const applyChange = () => {
    setSizeStocks(prev => ({
      ...prev,
      [selectedSize]: calculateNewStock()
    }));
    setStockChange(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(sizeStocks);
  };

  const totalStock = Object.values(sizeStocks).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-sm w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-lg font-bold text-foreground">Update Stock by Size</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="font-medium text-foreground">{product.name}</p>
          </div>

          {/* Current stock by size */}
          <div className="p-3 bg-secondary rounded-sm">
            <p className="text-sm text-muted-foreground mb-2">Current Stock by Size</p>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`p-2 rounded text-center transition-colors ${
                    selectedSize === size 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background border border-border hover:bg-accent'
                  }`}
                >
                  <p className="text-xs font-medium">{size}</p>
                  <p className="text-lg font-bold">{sizeStocks[size]}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-right">Total: {totalStock}</p>
          </div>

          {/* Update controls for selected size */}
          <div className="space-y-3 p-3 border border-border rounded-sm">
            <p className="text-sm font-medium text-foreground">Update Size {selectedSize}</p>
            
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

            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label htmlFor="quantity" className="text-xs">
                  {changeType === 'set' ? 'New Quantity' : 'Quantity'}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={stockChange}
                  onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
                  className="h-9"
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={applyChange} className="h-9">
                Apply to {selectedSize}
              </Button>
            </div>
            
            {stockChange > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedSize} will be: {getCurrentStock()} → {calculateNewStock()}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeStockUpdateDialog;
