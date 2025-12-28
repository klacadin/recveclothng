import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Settings,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  PackageCheck,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUpdateStock, type Product, type ProductInsert } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/admin/ProductForm";
import StockUpdateDialog from "@/components/admin/StockUpdateDialog";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdateProduct, setStockUpdateProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateStock = useUpdateStock();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock_quantity <= p.low_stock_threshold);
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0);
  const totalValue = products.reduce((sum, p) => sum + Number(p.price) * p.stock_quantity, 0);

  const handleCreateProduct = async (data: ProductInsert) => {
    try {
      await createProduct.mutateAsync(data);
      toast({ title: "Product created", description: "The product has been added successfully." });
      setShowProductForm(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateProduct = async (data: ProductInsert) => {
    if (!editingProduct) return;
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, updates: data });
      toast({ title: "Product updated", description: "The product has been updated successfully." });
      setEditingProduct(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Product deleted", description: "The product has been removed." });
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleStockUpdate = async (newStock: number) => {
    if (!stockUpdateProduct) return;
    try {
      await updateStock.mutateAsync({ id: stockUpdateProduct.id, stockQuantity: newStock });
      toast({ title: "Stock updated", description: "Inventory has been updated successfully." });
      setStockUpdateProduct(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (product.stock_quantity <= product.low_stock_threshold) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-xl font-bold text-foreground">REVE Admin</h1>
          <p className="text-xs text-muted-foreground mt-1">Inventory Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
                activeTab === item.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
          {isAdmin && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded">
              Admin
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full mt-3 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground capitalize">
              {activeTab}
            </h2>
            <div className="flex items-center gap-3">
              {activeTab === "inventory" && (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <Button variant="red" size="sm" onClick={() => setShowProductForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-sm border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Products</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{products.length}</p>
                </div>
                <div className="bg-card p-4 rounded-sm border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Low Stock Items</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{lowStockProducts.length}</p>
                  {lowStockProducts.length > 0 && (
                    <p className="text-xs text-yellow-600 mt-1">Action needed</p>
                  )}
                </div>
                <div className="bg-card p-4 rounded-sm border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Out of Stock</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{outOfStockProducts.length}</p>
                  {outOfStockProducts.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">Restock required</p>
                  )}
                </div>
                <div className="bg-card p-4 rounded-sm border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Inventory Value</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">₱{totalValue.toLocaleString()}</p>
                </div>
              </div>

              {lowStockProducts.length > 0 && (
                <div className="bg-card rounded-sm border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Low Stock Alerts
                  </h3>
                  <div className="space-y-2">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-secondary rounded-sm">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{product.stock_quantity} left</p>
                          <p className="text-xs text-muted-foreground">Threshold: {product.low_stock_threshold}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Inventory Table */}
          {activeTab === "inventory" && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Products ({filteredProducts.length})
                </h3>
              </div>
              
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">SKU</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stock</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product);
                      return (
                        <tr key={product.id} className="border-t border-border hover:bg-secondary/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {product.image_url && (
                                <div className="w-10 h-10 bg-secondary rounded overflow-hidden">
                                  <img 
                                    src={product.image_url} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-foreground">{product.name}</p>
                                {!product.is_active && (
                                  <span className="text-xs text-muted-foreground">Inactive</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono text-muted-foreground">{product.sku || '-'}</td>
                          <td className="p-4 text-sm text-muted-foreground">{product.category || '-'}</td>
                          <td className="p-4 text-sm font-medium text-foreground">₱{Number(product.price).toLocaleString()}</td>
                          <td className="p-4">
                            <button
                              onClick={() => setStockUpdateProduct(product)}
                              className="text-sm font-medium text-foreground hover:underline"
                            >
                              {product.stock_quantity}
                            </button>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {deleteConfirmId === product.id ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    disabled={deleteProduct.isPending}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteConfirmId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => setDeleteConfirmId(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div className="bg-card rounded-sm border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Order Workflow</h3>
                <div className="flex items-center justify-between">
                  {["New", "Paid", "Packed", "Shipped", "Completed"].map((step, idx, arr) => (
                    <div key={step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                          {idx + 1}
                        </div>
                        <p className="text-xs font-medium mt-2">{step}</p>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="w-16 h-0.5 bg-border mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-sm border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Courier Partners</h3>
                <div className="grid grid-cols-3 gap-4">
                  {["J&T Express", "LBC", "Grab Express"].map((courier) => (
                    <div key={courier} className="p-4 bg-secondary rounded-sm text-center">
                      <p className="font-medium text-foreground">{courier}</p>
                      <p className="text-xs text-muted-foreground mt-1">Active</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-card rounded-sm border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Store Settings</h3>
              <p className="text-muted-foreground text-sm">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      {(showProductForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          isSubmitting={createProduct.isPending || updateProduct.isPending}
        />
      )}

      {/* Stock Update Modal */}
      {stockUpdateProduct && (
        <StockUpdateDialog
          product={stockUpdateProduct}
          onUpdate={handleStockUpdate}
          onCancel={() => setStockUpdateProduct(null)}
          isSubmitting={updateStock.isPending}
        />
      )}
    </div>
  );
};

export default Admin;
