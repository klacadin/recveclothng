import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SIZES, type ProductSize, type SizeStock } from '@/hooks/useProductVariants';

interface SizeStockInputProps {
  sizeStocks: SizeStock;
  onChange: (sizeStocks: SizeStock) => void;
  disabled?: boolean;
}

const SizeStockInput = ({ sizeStocks, onChange, disabled }: SizeStockInputProps) => {
  const handleChange = (size: ProductSize, value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({
      ...sizeStocks,
      [size]: Math.max(0, numValue),
    });
  };

  const totalStock = Object.values(sizeStocks).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Stock by Size</Label>
        <span className="text-xs text-muted-foreground">
          Total: {totalStock}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {SIZES.map((size) => (
          <div key={size} className="space-y-1">
            <Label htmlFor={`size-${size}`} className="text-xs text-muted-foreground">
              {size}
            </Label>
            <Input
              id={`size-${size}`}
              type="number"
              min="0"
              value={sizeStocks[size]}
              onChange={(e) => handleChange(size, e.target.value)}
              disabled={disabled}
              className="h-9 text-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeStockInput;
