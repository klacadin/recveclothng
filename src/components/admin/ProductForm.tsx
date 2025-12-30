import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import type { Product, ProductInsert } from '@/hooks/useProducts';
import SizeStockInput from './SizeStockInput';
import { type SizeStock, type ProductVariant, variantsToSizeStock } from '@/hooks/useProductVariants';

interface ProductFormProps {
  product?: Product | null;
  productVariants?: ProductVariant[];
  onSubmit: (data: ProductInsert, sizeStocks: SizeStock) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ProductForm = ({ product, productVariants, onSubmit, onCancel, isSubmitting }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductInsert>({
    name: '',
    description: '',
    price: 0,
    sku: '',
    category: '',
    image_url: '',
    images: [],
    stock_quantity: 0,
    low_stock_threshold: 10,
    is_active: true,
  });
  const [sizeStocks, setSizeStocks] = useState<SizeStock>({ S: 0, M: 0, L: 0, XL: 0 });
  const [newImageUrl, setNewImageUrl] = useState('');
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useImageUpload();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        sku: product.sku || '',
        category: product.category || '',
        image_url: product.image_url || '',
        images: (product as any).images || [],
        stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold,
        is_active: product.is_active,
      });
    }
  }, [product]);

  useEffect(() => {
    if (productVariants && productVariants.length > 0) {
      setSizeStocks(variantsToSizeStock(productVariants));
    }
  }, [productVariants]);

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadImage(file);
    if (url) {
      setFormData({ ...formData, image_url: url });
    }
    // Reset input
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadImage(file);
    if (url) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), url],
      });
    }
    // Reset input
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = '';
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImageUrl.trim()],
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: (formData.images || []).filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate total stock from size stocks
    const totalStock = Object.values(sizeStocks).reduce((sum, qty) => sum + qty, 0);
    onSubmit({ ...formData, stock_quantity: totalStock }, sizeStocks);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₱) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          {/* Main Image Upload */}
          <div className="space-y-2">
            <Label>Main Image</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="Image URL or upload"
                className="flex-1"
              />
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => mainImageInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formData.image_url && (
              <div className="relative w-32 h-32 mt-2">
                <img
                  src={formData.image_url}
                  alt="Main product"
                  className="w-full h-full object-cover rounded border border-border"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <Label>Additional Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addImage} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <input
                ref={additionalImagesInputRef}
                type="file"
                accept="image/*"
                onChange={handleAdditionalImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => additionalImagesInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={img} 
                      alt={`Product ${idx + 1}`} 
                      className="w-full h-20 object-cover rounded border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Size Stock Inputs */}
          <SizeStockInput 
            sizeStocks={sizeStocks} 
            onChange={setSizeStocks} 
            disabled={isSubmitting}
          />

          <div className="space-y-2">
            <Label htmlFor="low_stock_threshold">Low Stock Threshold (per size)</Label>
            <Input
              id="low_stock_threshold"
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 10 })}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Product is active</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="flex-1">
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
