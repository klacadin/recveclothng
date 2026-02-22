import { useState } from 'react';
import { Plus, Trash2, Edit, Ticket, Layers, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useVouchers,
  useCreateVoucher,
  useUpdateVoucher,
  useDeleteVoucher,
  type Voucher,
  type VoucherInsert,
} from '@/hooks/useVouchers';
import { useProductCategories } from '@/hooks/useCategories';
import { useActiveProducts } from '@/hooks/useProducts';

const defaultForm: VoucherInsert & { id?: string } = {
  code: '',
  discount_type: 'percent',
  discount_value: 0,
  min_order_amount: 0,
  expires_at: null,
  is_active: true,
  max_uses: null,
  description: '',
  product_ids: [],
  category_ids: [],
};

const VoucherManagement = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: vouchers = [], isLoading } = useVouchers();
  const { data: categories = [] } = useProductCategories();
  const { data: products = [] } = useActiveProducts();
  const createVoucher = useCreateVoucher();
  const updateVoucher = useUpdateVoucher();
  const deleteVoucher = useDeleteVoucher();

  const openCreate = () => {
    setForm(defaultForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (v: Voucher) => {
    setEditing(v);
    setForm({
      code: v.code,
      discount_type: v.discount_type,
      discount_value: v.discount_value,
      min_order_amount: v.min_order_amount ?? 0,
      expires_at: v.expires_at,
      is_active: v.is_active,
      max_uses: v.max_uses,
      description: v.description ?? '',
      product_ids: Array.isArray(v.product_ids) ? v.product_ids : [],
      category_ids: Array.isArray(v.category_ids) ? v.category_ids : [],
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast({ title: 'Error', description: 'Voucher code is required', variant: 'destructive' });
      return;
    }
    if (form.discount_value <= 0) {
      toast({ title: 'Error', description: 'Discount value must be greater than 0', variant: 'destructive' });
      return;
    }
    if (form.discount_type === 'percent' && form.discount_value > 100) {
      toast({ title: 'Error', description: 'Percent discount cannot exceed 100%', variant: 'destructive' });
      return;
    }

    try {
      if (editing) {
        await updateVoucher.mutateAsync({
          id: editing.id,
          updates: {
            code: form.code,
            discount_type: form.discount_type,
            discount_value: form.discount_value,
            min_order_amount: form.min_order_amount || null,
            expires_at: form.expires_at || null,
            is_active: form.is_active,
            max_uses: form.max_uses || null,
            description: form.description?.trim() || null,
            product_ids: form.product_ids?.length ? form.product_ids : [],
            category_ids: form.category_ids?.length ? form.category_ids : [],
          },
        });
        toast({ title: 'Voucher updated' });
      } else {
        await createVoucher.mutateAsync({
          code: form.code,
          discount_type: form.discount_type,
          discount_value: form.discount_value,
          min_order_amount: form.min_order_amount || null,
          expires_at: form.expires_at || null,
          is_active: form.is_active,
          max_uses: form.max_uses || null,
          description: form.description?.trim() || null,
          product_ids: form.product_ids?.length ? form.product_ids : [],
          category_ids: form.category_ids?.length ? form.category_ids : [],
        });
        toast({ title: 'Voucher created' });
      }
      setShowForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save voucher';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteVoucher.mutateAsync(deleteId);
      toast({ title: 'Voucher deleted' });
      setDeleteId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const formatDiscount = (v: Voucher) => {
    if (v.discount_type === 'percent') return `${v.discount_value}% off`;
    return `₱${Number(v.discount_value).toLocaleString()} off`;
  };

  const formatScope = (v: Voucher) => {
    const pids = Array.isArray(v.product_ids) ? v.product_ids : [];
    const cids = Array.isArray(v.category_ids) ? v.category_ids : [];
    if (pids.length === 0 && cids.length === 0) return 'All';
    const parts: string[] = [];
    if (cids.length) parts.push(`${cids.length} cat.`);
    if (pids.length) parts.push(`${pids.length} prod.`);
    return parts.join(', ') || 'All';
  };

  const toggleCategory = (id: string) => {
    const current = form.category_ids ?? [];
    const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
    setForm((f) => ({ ...f, category_ids: next }));
  };

  const toggleProduct = (id: string) => {
    const current = form.product_ids ?? [];
    const next = current.includes(id) ? current.filter((p) => p !== id) : [...current, id];
    setForm((f) => ({ ...f, product_ids: next }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Voucher Codes
        </h3>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Voucher
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Create discount codes for customers to use at checkout. Codes are case-insensitive.
      </p>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading vouchers...</div>
      ) : vouchers.length === 0 ? (
        <div className="py-12 text-center rounded-sm border border-dashed border-border">
          <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">No vouchers yet</p>
          <Button variant="outline" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add your first voucher
          </Button>
        </div>
      ) : (
        <div className="rounded-sm border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Code</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Discount</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Scope</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Min Order</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Uses</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Status</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4 font-mono font-medium">{v.code}</td>
                  <td className="p-4">{formatDiscount(v)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{formatScope(v)}</td>
                  <td className="p-4">{v.min_order_amount ? `₱${Number(v.min_order_amount).toLocaleString()}` : '—'}</td>
                  <td className="p-4">
                    {v.max_uses != null ? `${v.times_used} / ${v.max_uses}` : v.times_used}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${v.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {v.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(v)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(v.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Voucher' : 'Add Voucher'}</DialogTitle>
            <DialogDescription>Create a discount code for customers to use at checkout.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. WELCOME10"
                className="font-mono"
                disabled={!!editing}
              />
              {editing && <p className="text-xs text-muted-foreground mt-1">Code cannot be changed after creation.</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_type">Discount Type</Label>
                <select
                  id="discount_type"
                  value={form.discount_type}
                  onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed amount (₱)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="discount_value">{form.discount_type === 'percent' ? 'Discount %' : 'Amount ₱'}</Label>
                <Input
                  id="discount_value"
                  type="number"
                  min={0}
                  max={form.discount_type === 'percent' ? 100 : undefined}
                  step={form.discount_type === 'percent' ? 1 : 0.01}
                  value={form.discount_value || ''}
                  onChange={(e) => setForm((f) => ({ ...f, discount_value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="min_order">Minimum Order (₱)</Label>
              <Input
                id="min_order"
                type="number"
                min={0}
                step={1}
                value={form.min_order_amount ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, min_order_amount: parseFloat(e.target.value) || 0 }))}
                placeholder="0 = no minimum"
              />
            </div>
            <div>
              <Label htmlFor="max_uses">Max Uses</Label>
              <Input
                id="max_uses"
                type="number"
                min={1}
                value={form.max_uses ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value ? parseInt(e.target.value, 10) : null }))}
                placeholder="Leave empty for unlimited"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4" />
                Apply to categories (optional)
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Leave empty for all. Select categories to limit discount.</p>
              <div className="border rounded-md p-3 max-h-32 overflow-y-auto space-y-2">
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox
                      checked={(form.category_ids ?? []).includes(c.id)}
                      onCheckedChange={() => toggleCategory(c.id)}
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
                {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories</p>}
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4" />
                Apply to products (optional)
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Leave empty for all. Select products to limit discount.</p>
              <div className="border rounded-md p-3 max-h-32 overflow-y-auto space-y-2">
                {products.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox
                      checked={(form.product_ids ?? []).includes(p.id)}
                      onCheckedChange={() => toggleProduct(p.id)}
                    />
                    <span className="truncate">{p.name}</span>
                    {p.sku && <span className="text-muted-foreground text-xs">({p.sku})</span>}
                  </label>
                ))}
                {products.length === 0 && <p className="text-sm text-muted-foreground">No products</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={form.description ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Welcome discount for new customers"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: !!checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createVoucher.isPending || updateVoucher.isPending}>
                {editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete voucher?</DialogTitle>
            <DialogDescription>This cannot be undone. The code will no longer work at checkout.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteVoucher.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoucherManagement;
