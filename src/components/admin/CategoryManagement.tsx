import { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree, X, Check, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCategoryProductCounts,
  slugify,
  type Category,
  type CategoryInsert,
} from '@/hooks/useCategories';

interface CategoryFormData {
  name: string;
  slug: string;
  code: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

const defaultFormData: CategoryFormData = {
  name: '',
  slug: '',
  code: '',
  description: '',
  image_url: '',
  is_active: true,
};

// Preset codes for quick add
const PRESET_CATEGORIES = [
  { name: 'Running Shirt', code: 'SHRT', slug: 'running-shirt' },
  { name: 'Running Shorts', code: 'SHORT', slug: 'running-shorts' },
  { name: 'Running Singlets', code: 'SING', slug: 'running-singlets' },
  { name: 'Running Long Sleeves', code: 'LSLV', slug: 'running-long-sleeves' },
];

const CategoryManagement = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useCategories();
  const { data: productCounts = {} } = useCategoryProductCounts();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when name changes
      if (field === 'name' && typeof value === 'string') {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      code: category.code || '',
      description: category.description || '',
      image_url: category.image_url || '',
      is_active: category.is_active,
    });
    setShowForm(true);
  };

  const handlePreset = (preset: { name: string; code: string; slug: string }) => {
    setFormData({
      ...defaultFormData,
      name: preset.name,
      slug: preset.slug,
      code: preset.code,
    });
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }

    const categoryData: CategoryInsert = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || slugify(formData.name),
      code: formData.code.trim().toUpperCase() || null,
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim() || null,
      parent_id: null,
      sort_order: editingCategory ? editingCategory.sort_order : categories.length + 1,
      is_active: formData.is_active,
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, updates: categoryData });
        toast({ title: 'Category updated', description: 'The category has been updated successfully.' });
      } else {
        await createCategory.mutateAsync(categoryData);
        toast({ title: 'Category created', description: 'The category has been added successfully.' });
      }
      handleCancel();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast({ title: 'Category deleted', description: 'The category has been removed.' });
      setDeleteConfirmId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData(defaultFormData);
  };

  return (
    <div className="space-y-6">
      {/* Header + Quick Add (WordPress-style) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Categories</h3>
            <p className="text-sm text-muted-foreground">Add categories for products — like WordPress</p>
          </div>
          <Button variant="red" size="sm" onClick={() => { setFormData(defaultFormData); setEditingCategory(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Quick-add presets */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground self-center mr-2">Quick add:</span>
          {PRESET_CATEGORIES.map((preset) => (
            <Button
              key={preset.code}
              variant="outline"
              size="sm"
              onClick={() => handlePreset(preset)}
              className="text-xs"
            >
              {preset.name} ({preset.code})
            </Button>
          ))}
        </div>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-sm p-6">
          <h4 className="font-semibold text-foreground mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Running Shirt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="SHRT"
                  className="font-mono uppercase max-w-[100px]"
                  maxLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="running-shirt"
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description (optional)"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Published</Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="red" disabled={createCategory.isPending || updateCategory.isPending}>
                  {editingCategory ? 'Update' : 'Add Category'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No categories yet</p>
            <p className="text-sm text-muted-foreground">Create your first category to organize products</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-20">Code</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Slug</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Products</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-10 h-10 object-contain bg-secondary rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{category.name}</p>
                        {category.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                      {category.code || '—'}
                    </code>
                  </td>
                  <td className="p-4">
                    <code className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {productCounts[category.name] || 0} products
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        category.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {deleteConfirmId === category.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={deleteCategory.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirmId(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
