import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  Search,
  Newspaper,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  PackageCheck,
  TruckIcon,
  LogOut,
  AlertTriangle,
  Eye,
  AlertCircle,
  Copy,
  ToggleLeft,
  ToggleRight,
  Tag,
  X,
  Download,
  Users,
  LayoutGrid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUpdateStock, type Product, type ProductInsert } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useCategories";
import { useOrders, useCreateOrder, useUpdateOrderStatus, useUpdateOrder, useDeleteOrder, type Order, type OrderWithItems } from "@/hooks/useOrders";
import { useAllProductVariants, useCreateVariantsForProduct, useBulkUpdateVariants, type SizeStock, type ProductVariant, variantsToSizeStock, SIZES } from "@/hooks/useProductVariants";
import { useBulkProductActions } from "@/hooks/useBulkProductActions";
import { useBulkOrderActions } from "@/hooks/useBulkOrderActions";
import { usePendingUsers } from "@/hooks/useUserApprovals";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/admin/ProductForm";
import SizeStockUpdateDialog from "@/components/admin/SizeStockUpdateDialog";
import OrderForm from "@/components/admin/OrderForm";
import AdminSettings from "@/components/admin/AdminSettings";
import UserApprovals from "@/components/admin/UserApprovals";
import CategoryManagement from "@/components/admin/CategoryManagement";
import ArticleManagement from "@/components/admin/ArticleManagement";
import ProductCard from "@/components/product/ProductCard";
import { getProductDisplayImage } from "@/data/productImages";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  pending_payment: { label: "Pending payment", color: "bg-amber-100 text-amber-800", icon: Clock },
  for_verification: { label: "For verification", color: "bg-orange-100 text-orange-800", icon: AlertCircle },
  paid: { label: "Paid", color: "bg-green-100 text-green-800", icon: CheckCircle },
  preparing: { label: "Preparing", color: "bg-yellow-100 text-yellow-800", icon: PackageCheck },
  packed: { label: "Packed", color: "bg-yellow-100 text-yellow-800", icon: PackageCheck },
  for_pickup: { label: "For pickup", color: "bg-indigo-100 text-indigo-800", icon: TruckIcon },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: TruckIcon },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

const paymentLabels: Record<string, string> = {
  cod: "COD",
  gcash: "GCash",
  maya: "Maya",
  bank_transfer: "Bank",
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdateProduct, setStockUpdateProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [bulkCategoryInput, setBulkCategoryInput] = useState("");
  const [showBulkCategoryInput, setShowBulkCategoryInput] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [inventoryView, setInventoryView] = useState<"table" | "preview">("table");
  const [waybillInput, setWaybillInput] = useState("");
  const [verificationRefInput, setVerificationRefInput] = useState("");
  const [paidRefDialogOrder, setPaidRefDialogOrder] = useState<{ id: string; order_number: string } | null>(null);
  const [paidRefInput, setPaidRefInput] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'new' | 'paid' | 'packed' | 'shipped' | 'completed'>('all');
  const [openArticleFormImmediately, setOpenArticleFormImmediately] = useState(false);

  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useProductCategories();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: allVariants = [] } = useAllProductVariants();
  const { data: pendingUsers = [] } = usePendingUsers();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateStock = useUpdateStock();
  const createOrder = useCreateOrder();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const createVariants = useCreateVariantsForProduct();
  const bulkUpdateVariants = useBulkUpdateVariants();

  // Group variants by product ID for quick lookup
  const variantsByProduct = allVariants.reduce((acc, v) => {
    if (!acc[v.product_id]) acc[v.product_id] = [];
    acc[v.product_id].push(v);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  const {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount,
    hasSelection,
    bulkDelete,
    bulkActivate,
    bulkDeactivate,
    bulkUpdateCategory,
  } = useBulkProductActions();

  const {
    selectedIds: selectedOrderIds,
    toggleSelection: toggleOrderSelection,
    selectAll: selectAllOrders,
    clearSelection: clearOrderSelection,
    isSelected: isOrderSelected,
    selectedCount: selectedOrderCount,
    hasSelection: hasOrderSelection,
    bulkUpdateStatus: bulkUpdateOrderStatus,
    bulkExportCSV: bulkExportOrdersCSV,
  } = useBulkOrderActions();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "news", label: "News & Blog", icon: Newspaper },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "users", label: "User Approvals", icon: Users },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchFilteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusFilterMatch = (order: Order) => {
    switch (orderStatusFilter) {
      case 'all': return true;
      case 'new': return ['new', 'pending_payment', 'for_verification'].includes(order.status);
      case 'paid': return order.status === 'paid' || order.status === 'preparing';
      case 'packed': return order.status === 'packed' || order.status === 'for_pickup';
      case 'shipped': return order.status === 'shipped';
      case 'completed': return order.status === 'completed';
      default: return true;
    }
  };
  const filteredOrders = searchFilteredOrders.filter(statusFilterMatch);

  const lowStockProducts = products.filter(p => p.stock_quantity <= p.low_stock_threshold);
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + Number(p.price) * p.stock_quantity, 0);
  
  const newOrders = orders.filter(o => ['new', 'pending_payment', 'for_verification'].includes(o.status));
  const pendingShipment = orders.filter(o => ['paid', 'preparing', 'packed', 'for_pickup'].includes(o.status));
  const todayRevenue = orders
    .filter(o => o.status !== 'cancelled' && new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + Number(o.total), 0);

  const handleCreateProduct = async (data: ProductInsert, sizeStocks: SizeStock) => {
    try {
      const product = await createProduct.mutateAsync(data);
      // Create variants for the new product
      await createVariants.mutateAsync({ productId: product.id, sizeStocks });
      toast({ title: "Product created", description: "The product has been added successfully." });
      setShowProductForm(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleUpdateProduct = async (data: ProductInsert, sizeStocks: SizeStock) => {
    if (!editingProduct) return;
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, updates: data });
      // Update variants for the product
      const variants = SIZES.map(size => ({
        size,
        stock_quantity: sizeStocks[size],
        low_stock_threshold: data.low_stock_threshold || 5,
      }));
      await bulkUpdateVariants.mutateAsync({ productId: editingProduct.id, variants });
      toast({ title: "Product updated", description: "The product has been updated successfully." });
      setEditingProduct(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Product deleted", description: "The product has been removed." });
      setDeleteConfirmId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      const duplicatedProduct = {
        name: `${product.name} (Copy)`,
        description: product.description,
        price: Number(product.price),
        sku: product.sku ? `${product.sku}-COPY` : null,
        category: product.category,
        image_url: product.image_url,
        images: product.images || [],
        stock_quantity: 0, // Start with 0 stock for duplicates
        low_stock_threshold: product.low_stock_threshold,
        is_active: false, // Duplicates start as inactive
      };
      const newProduct = await createProduct.mutateAsync(duplicatedProduct);
      // Create variants with 0 stock for the duplicated product
      await createVariants.mutateAsync({ 
        productId: newProduct.id, 
        sizeStocks: { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 } 
      });
      toast({ title: "Product duplicated", description: "A copy of the product has been created." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleCategoryChange = async (productId: string, category: string) => {
    try {
      await updateProduct.mutateAsync({ id: productId, updates: { category } });
      toast({ title: "Category updated", description: "Product category has been updated." });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleStockUpdate = async (newStock: number) => {
    if (!stockUpdateProduct) return;
    try {
      await updateStock.mutateAsync({ id: stockUpdateProduct.id, stockQuantity: newStock });
      toast({ title: "Stock updated", description: "Inventory has been updated successfully." });
      setStockUpdateProduct(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleCreateOrder = async (order: unknown, items: unknown[]) => {
    try {
      await createOrder.mutateAsync({ order, items });
      toast({ title: "Order created", description: "The order has been created successfully." });
      setShowOrderForm(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status });
      toast({ title: "Status updated", description: `Order status changed to ${status}.` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder.mutateAsync(id);
      toast({ title: "Order deleted", description: "The order has been removed." });
      setDeleteOrderId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
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

  const exportInventoryCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Stock Quantity', 'Low Stock Threshold', 'Status', 'Active'];
    const csvRows = [headers.join(',')];

    filteredProducts.forEach(product => {
      const status = getStockStatus(product);
      const row = [
        `"${product.name.replace(/"/g, '""')}"`,
        `"${(product.sku || '').replace(/"/g, '""')}"`,
        `"${(product.category || '').replace(/"/g, '""')}"`,
        product.price,
        product.stock_quantity,
        product.low_stock_threshold,
        `"${status.label}"`,
        product.is_active ? 'Yes' : 'No'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: 'Export complete', description: `Exported ${filteredProducts.length} products to CSV.` });
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-xl font-bold text-foreground">REVE Admin</h1>
          <p className="text-xs text-muted-foreground mt-1">Operations Dashboard</p>
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
              {item.id === 'orders' && newOrders.length > 0 && (
                <span className="ml-auto bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded">
                  {newOrders.length}
                </span>
              )}
              {item.id === 'users' && pendingUsers.length > 0 && (
                <span className="ml-auto bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded">
                  {pendingUsers.length}
                </span>
              )}
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
              {(activeTab === "inventory" || activeTab === "orders") && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={activeTab === "orders" ? "Search orders..." : "Search products..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}
              {activeTab === "inventory" && (
                <>
                  <Button variant="outline" size="sm" onClick={exportInventoryCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="red" size="sm" onClick={() => setShowProductForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </>
              )}
              {activeTab === "orders" && (
                <Button variant="red" size="sm" onClick={() => setShowOrderForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Quick overview of your store. Click any card to jump to the relevant section.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab("orders"); setOrderStatusFilter("new"); }}
                  className="bg-card p-5 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                    {newOrders.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                        {newOrders.length}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground mt-2">{newOrders.length}</p>
                  <p className="text-sm font-medium text-foreground">New Orders</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Awaiting processing</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("orders"); setOrderStatusFilter("paid"); }}
                  className="bg-card p-5 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <TruckIcon className="h-8 w-8 text-amber-600" />
                    {pendingShipment.length > 0 && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">
                        {pendingShipment.length}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground mt-2">{pendingShipment.length}</p>
                  <p className="text-sm font-medium text-foreground">To Ship</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Paid & ready to pack</p>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("inventory")}
                  className="bg-card p-5 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    {lowStockProducts.length > 0 && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                        {lowStockProducts.length}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground mt-2">{lowStockProducts.length}</p>
                  <p className="text-sm font-medium text-foreground">Low Stock</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {outOfStockProducts.length > 0 ? `${outOfStockProducts.length} out of stock` : "Action needed"}
                  </p>
                </button>
                <div className="bg-card p-5 rounded-sm border border-border">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <p className="font-display text-2xl font-bold text-foreground mt-2">₱{todayRevenue.toLocaleString()}</p>
                  <p className="text-sm font-medium text-foreground">Today's Revenue</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {orders.filter((o) => o.status !== "cancelled").length} orders total
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-card rounded-sm border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => { setActiveTab("orders"); setShowOrderForm(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                  <Button variant="outline" onClick={() => { setActiveTab("inventory"); setShowProductForm(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" onClick={() => { setActiveTab("news"); setOpenArticleFormImmediately(true); }}>
                    <Newspaper className="h-4 w-4 mr-2" />
                    Add Blog Post
                  </Button>
                  <Button variant="outline" onClick={() => { setActiveTab("shipping"); }}>
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Order Workflow
                  </Button>
                  {pendingUsers.length > 0 && (
                    <Button variant="outline" onClick={() => setActiveTab("users")}>
                      <Users className="h-4 w-4 mr-2" />
                      Approve Users ({pendingUsers.length})
                    </Button>
                  )}
                </div>
              </div>

              {lowStockProducts.length > 0 && (
                <div className="bg-card rounded-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      Low Stock Alerts
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("inventory")}>
                      View all
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => { setActiveTab("inventory"); setStockUpdateProduct(product); }}
                        className="w-full flex items-center justify-between p-3 bg-secondary rounded-sm hover:bg-secondary/80 transition-colors text-left"
                      >
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sku || "—"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{product.stock_quantity} left</p>
                          <p className="text-xs text-muted-foreground">Threshold: {product.low_stock_threshold}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Orders ({filteredOrders.length})
                  </h3>
                </div>
                {/* Order workflow quick-filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all' as const, label: 'All', count: searchFilteredOrders.length },
                    { id: 'new' as const, label: 'New', count: searchFilteredOrders.filter(o => ['new', 'pending_payment', 'for_verification'].includes(o.status)).length },
                    { id: 'paid' as const, label: 'Paid', count: searchFilteredOrders.filter(o => o.status === 'paid' || o.status === 'preparing').length },
                    { id: 'packed' as const, label: 'Packed', count: searchFilteredOrders.filter(o => o.status === 'packed' || o.status === 'for_pickup').length },
                    { id: 'shipped' as const, label: 'Shipped', count: searchFilteredOrders.filter(o => o.status === 'shipped').length },
                    { id: 'completed' as const, label: 'Completed', count: searchFilteredOrders.filter(o => o.status === 'completed').length },
                  ].map(({ id, label, count }) => (
                    <Button
                      key={id}
                      variant={orderStatusFilter === id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOrderStatusFilter(id)}
                      className="shrink-0"
                    >
                      {label}
                      <span className="ml-1.5 text-xs opacity-80">({count})</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Order bulk actions toolbar */}
              {hasOrderSelection && (
                <div className="p-4 bg-accent/10 border-b border-border flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {selectedOrderCount} order{selectedOrderCount !== 1 ? 's' : ''} selected
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearOrderSelection}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <Select
                    onValueChange={(value: Order['status']) => {
                      bulkUpdateOrderStatus.mutate({
                        ids: Array.from(selectedOrderIds),
                        status: value,
                      });
                    }}
                  >
                    <SelectTrigger className="w-40 h-8">
                      <SelectValue placeholder="Set status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preparing">→ Preparing</SelectItem>
                      <SelectItem value="packed">→ Packed</SelectItem>
                      <SelectItem value="for_pickup">→ For pickup</SelectItem>
                      <SelectItem value="shipped">→ Shipped</SelectItem>
                      <SelectItem value="completed">→ Completed</SelectItem>
                      <SelectItem value="cancelled">→ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      bulkExportOrdersCSV(
                        filteredOrders.map((o) => ({
                          id: o.id,
                          order_number: o.order_number,
                          customer_name: o.customer_name,
                          customer_email: o.customer_email,
                          total: Number(o.total),
                          status: o.status,
                          created_at: o.created_at,
                        }))
                      )
                    }
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </Button>
                </div>
              )}

              {ordersLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="p-4 w-12">
                        <Checkbox
                          checked={
                            selectedOrderCount === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              selectAllOrders(filteredOrders.map((o) => o.id));
                            } else {
                              clearOrderSelection();
                            }
                          }}
                          aria-label="Select all orders"
                        />
                      </th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const status = statusConfig[order.status] || statusConfig.new;
                      return (
                        <tr
                          key={order.id}
                          className={`border-t border-border hover:bg-secondary/50 ${isOrderSelected(order.id) ? 'bg-accent/5' : ''}`}
                        >
                          <td className="p-4">
                            <Checkbox
                              checked={isOrderSelected(order.id)}
                              onCheckedChange={() => toggleOrderSelection(order.id)}
                              aria-label={`Select order ${order.order_number}`}
                            />
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-medium text-foreground">{order.order_number}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-foreground">{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {order.order_items?.length || 0} items
                          </td>
                          <td className="p-4 text-sm font-medium text-foreground">
                            ₱{Number(order.total).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              order.payment_method === 'cod' ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                            }`}>
                              {paymentLabels[order.payment_method] || order.payment_method}
                            </span>
                          </td>
                          <td className="p-4">
                            <Select
                              value={order.status}
                              onValueChange={(value: Order['status']) => {
                                if (value === 'paid') {
                                  setPaidRefDialogOrder({ id: order.id, order_number: order.order_number });
                                  setPaidRefInput('');
                                } else {
                                  handleUpdateOrderStatus(order.id, value);
                                }
                              }}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded ${status.color}`}>
                                  <status.icon className="h-3 w-3" />
                                  {status.label}
                                </span>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="pending_payment">Pending payment</SelectItem>
                                <SelectItem value="for_verification">For verification</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="packed">Packed</SelectItem>
                                <SelectItem value="for_pickup">For pickup</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedOrder(order);
                        setWaybillInput((order as OrderWithItems & { waybill_number?: string | null }).waybill_number ?? '');
                        setVerificationRefInput('');
                      }}
                      aria-label={`View order ${order.order_number}`}
                    >
                                <Eye className="h-4 w-4" aria-hidden="true" />
                              </Button>
                              {deleteOrderId === order.id ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteOrder(order.id)}
                                    disabled={deleteOrder.isPending}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteOrderId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => setDeleteOrderId(order.id)}
                                  aria-label={`Delete order ${order.order_number}`}
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
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

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
                <h3 className="font-semibold text-foreground">
                  Products ({filteredProducts.length})
                </h3>
                <div className="flex items-center gap-1 border border-border rounded-sm p-0.5">
                  <Button
                    variant={inventoryView === "table" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setInventoryView("table")}
                    aria-label="Table view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={inventoryView === "preview" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setInventoryView("preview")}
                    aria-label="Preview product listing"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Bulk Actions Toolbar */}
              {hasSelection && (
                <div className="p-4 bg-accent/10 border-b border-border flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {selectedCount} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkActivate.mutate(Array.from(selectedIds))}
                    disabled={bulkActivate.isPending}
                  >
                    <ToggleRight className="h-4 w-4 mr-1" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkDeactivate.mutate(Array.from(selectedIds))}
                    disabled={bulkDeactivate.isPending}
                  >
                    <ToggleLeft className="h-4 w-4 mr-1" />
                    Deactivate
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  {showBulkCategoryInput ? (
                    <div className="flex items-center gap-2">
                      <Select
                        value={bulkCategoryInput || '_select'}
                        onValueChange={(v) => setBulkCategoryInput(v)}
                      >
                        <SelectTrigger className="h-8 w-48">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_select">Select category...</SelectItem>
                          <SelectItem value="_none">— None —</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name} {cat.code && `(${cat.code})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const cat = (bulkCategoryInput === '_select' || bulkCategoryInput === '_none') ? '' : (bulkCategoryInput || '').trim();
                          bulkUpdateCategory.mutate({ ids: Array.from(selectedIds), category: cat });
                          setBulkCategoryInput("");
                          setShowBulkCategoryInput(false);
                        }}
                        disabled={bulkUpdateCategory.isPending || !bulkCategoryInput || bulkCategoryInput === '_select'}
                      >
                        Apply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowBulkCategoryInput(false);
                          setBulkCategoryInput("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBulkCategoryInput(true)}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Set Category
                    </Button>
                  )}
                  <div className="h-4 w-px bg-border" />
                  {confirmBulkDelete ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          bulkDelete.mutate(Array.from(selectedIds));
                          setConfirmBulkDelete(false);
                        }}
                        disabled={bulkDelete.isPending}
                      >
                        Confirm Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmBulkDelete(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setConfirmBulkDelete(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              )}
              
              {productsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : inventoryView === "preview" ? (
                <div className="p-6">
                  <p className="text-xs text-muted-foreground mb-4">Preview how products appear on the shop — click to open product page</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map((product) => {
                      const totalStock = (variantsByProduct[product.id] || []).reduce((s, v) => s + v.stock_quantity, 0);
                      const inStock = totalStock > 0 && product.is_active;
                      return (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={Number(product.price)}
                          image={getProductDisplayImage(product)}
                          category={product.category || undefined}
                          isNew={false}
                          inStock={inStock}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="p-4 w-12">
                        <Checkbox
                          checked={selectedCount === filteredProducts.length && filteredProducts.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              selectAll(filteredProducts.map(p => p.id));
                            } else {
                              clearSelection();
                            }
                          }}
                        />
                      </th>
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
                        <tr key={product.id} className={`border-t border-border hover:bg-secondary/50 ${isSelected(product.id) ? 'bg-accent/5' : ''}`}>
                          <td className="p-4">
                            <Checkbox
                              checked={isSelected(product.id)}
                              onCheckedChange={() => toggleSelection(product.id)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-foreground">{product.name}</p>
                                {!product.is_active && (
                                  <span className="text-xs text-muted-foreground">Inactive</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono text-muted-foreground">{product.sku || '-'}</td>
                          <td className="p-4">
                            <Select
                              value={product.category || '_none'}
                              onValueChange={(value) => handleCategoryChange(product.id, value === '_none' ? '' : value)}
                            >
                              <SelectTrigger className="h-8 w-36 text-sm">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="_none">— None —</SelectItem>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.name}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4 text-sm font-medium text-foreground">₱{Number(product.price).toLocaleString()}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <button
                                onClick={() => setStockUpdateProduct(product)}
                                className="text-sm font-medium text-foreground hover:underline"
                              >
                                {product.stock_quantity} total
                              </button>
                              {variantsByProduct[product.id] && (
                                <div className="flex gap-1 text-xs text-muted-foreground">
                                  {variantsByProduct[product.id].map(v => (
                                    <span key={v.size} className="bg-secondary px-1 rounded">
                                      {v.size}:{v.stock_quantity}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
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
                                aria-label={`Edit ${product.name}`}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" aria-hidden="true" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDuplicateProduct(product)}
                                disabled={createProduct.isPending}
                                aria-label={`Duplicate ${product.name}`}
                                title="Duplicate"
                              >
                                <Copy className="h-4 w-4" aria-hidden="true" />
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
                                  aria-label={`Delete ${product.name}`}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
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
                <p className="text-sm text-muted-foreground mb-4">Click a step to go to Orders filtered by that status.</p>
                <div className="flex items-center justify-between">
                  {[
                    { step: "New", filter: 'new' as const },
                    { step: "Paid", filter: 'paid' as const },
                    { step: "Packed", filter: 'packed' as const },
                    { step: "Shipped", filter: 'shipped' as const },
                    { step: "Completed", filter: 'completed' as const },
                  ].map(({ step, filter }, idx, arr) => (
                    <div key={step} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => { setOrderStatusFilter(filter); setActiveTab('orders'); }}
                        className="flex flex-col items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                          {idx + 1}
                        </div>
                        <p className="text-xs font-medium mt-2 text-foreground">{step}</p>
                      </button>
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

          {/* News Tab */}
          {activeTab === "news" && (
            <div className="bg-card rounded-sm border border-border p-6">
              <ArticleManagement
                openFormImmediately={openArticleFormImmediately}
                onFormOpened={() => setOpenArticleFormImmediately(false)}
              />
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && <CategoryManagement />}

          {/* User Approvals Tab */}
          {activeTab === "users" && <UserApprovals />}

          {/* Settings Tab */}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </main>

      {/* Product Form Modal */}
      {(showProductForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          productVariants={editingProduct ? variantsByProduct[editingProduct.id] : undefined}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          isSubmitting={createProduct.isPending || updateProduct.isPending || createVariants.isPending || bulkUpdateVariants.isPending}
        />
      )}

      {/* Stock Update Modal */}
      {stockUpdateProduct && (
        <SizeStockUpdateDialog
          product={stockUpdateProduct}
          variants={variantsByProduct[stockUpdateProduct.id] || []}
          onUpdate={async (sizeStocks) => {
            try {
              const variants = SIZES.map(size => ({
                size,
                stock_quantity: sizeStocks[size],
              }));
              await bulkUpdateVariants.mutateAsync({ productId: stockUpdateProduct.id, variants });
              toast({ title: "Stock updated", description: "Inventory has been updated successfully." });
              setStockUpdateProduct(null);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
              toast({ title: "Error", description: errorMessage, variant: "destructive" });
            }
          }}
          onCancel={() => setStockUpdateProduct(null)}
          isSubmitting={bulkUpdateVariants.isPending}
        />
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          onSubmit={handleCreateOrder}
          onCancel={() => setShowOrderForm(false)}
          isSubmitting={createOrder.isPending}
        />
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">
                Order {selectedOrder.order_number}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Address</p>
                  <p className="text-foreground">{selectedOrder.shipping_address}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between p-3 bg-secondary rounded-sm">
                      <div>
                        <p className="font-medium text-foreground">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ₱{Number(item.unit_price).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium text-foreground">
                        ₱{Number(item.total_price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₱{Number(selectedOrder.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">₱{Number(selectedOrder.shipping_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₱{Number(selectedOrder.total).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment details — method and reference number */}
              <div className="p-4 border border-border rounded-sm space-y-1">
                <p className="text-sm font-medium text-foreground">Payment</p>
                <p className="text-sm text-muted-foreground">
                  Method: <span className="text-foreground">{paymentLabels[selectedOrder.payment_method] || selectedOrder.payment_method}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Reference: <span className="font-medium text-foreground">{(selectedOrder as OrderWithItems).payment_reference_number || "—"}</span>
                </p>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status change — Paid requires reference number via dialog */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value: Order['status']) => {
                    if (value === 'paid') {
                      setPaidRefDialogOrder({ id: selectedOrder.id, order_number: selectedOrder.order_number });
                      setPaidRefInput('');
                    } else {
                      handleUpdateOrderStatus(selectedOrder.id, value);
                      setSelectedOrder({ ...selectedOrder, status: value });
                    }
                  }}
                >
                  <SelectTrigger className="w-40">
                    <span className={statusConfig[selectedOrder.status] ? `inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded ${statusConfig[selectedOrder.status].color}` : ''}>
                      {statusConfig[selectedOrder.status]?.label ?? selectedOrder.status}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="pending_payment">Pending payment</SelectItem>
                    <SelectItem value="for_verification">For verification</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="packed">Packed</SelectItem>
                    <SelectItem value="for_pickup">For pickup</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Proof of payment — always visible when proof exists; store manager can view and verify */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-1">Proof of payment</p>
                {selectedOrder.proof_of_payment_url ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedOrder.proof_of_payment_url!, '_blank')}
                      >
                        View proof
                      </Button>
                      {(selectedOrder as OrderWithItems).payment_reference_number && (
                        <span className="text-sm text-muted-foreground">
                          Reference: <span className="font-medium text-foreground">{(selectedOrder as OrderWithItems).payment_reference_number}</span>
                        </span>
                      )}
                    </div>
                    {(selectedOrder.status === 'for_verification' || (selectedOrder.status === 'pending_payment' && selectedOrder.proof_of_payment_url)) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Input
                          placeholder="Reference number (required to verify)"
                          value={verificationRefInput}
                          onChange={(e) => setVerificationRefInput(e.target.value)}
                          className="max-w-xs"
                        />
                        <Button
                          size="sm"
                          onClick={async () => {
                            const ref = verificationRefInput.trim();
                            if (!ref) {
                              toast({ title: 'Reference required', description: 'Enter a reference number to verify proof.', variant: 'destructive' });
                              return;
                            }
                            try {
                              await updateOrder.mutateAsync({
                                id: selectedOrder.id,
                                updates: { status: 'paid', payment_reference_number: ref },
                              });
                              toast({ title: 'Proof verified', description: 'Order marked as Paid.' });
                              setSelectedOrder({ ...selectedOrder, status: 'paid', payment_reference_number: ref });
                              setVerificationRefInput('');
                            } catch (e) {
                              toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
                            }
                          }}
                          disabled={updateOrder.isPending}
                        >
                          Verify & Mark as Paid
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {['pending_payment', 'new'].includes(selectedOrder.status)
                      ? 'Waiting for customer to upload proof.'
                      : 'No proof uploaded.'}
                  </p>
                )}
              </div>

              {/* Waybill & for pickup */}
              {['preparing', 'paid', 'packed'].includes(selectedOrder.status) && (
                <div className="p-4 border border-border rounded-sm space-y-2">
                  <p className="text-sm font-medium text-foreground">J&T waybill</p>
                  <div className="flex gap-2 flex-wrap">
                    <Input
                      placeholder="Waybill number (after printing)"
                      value={waybillInput || (selectedOrder as OrderWithItems).waybill_number || ''}
                      onChange={(e) => setWaybillInput(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button
                      size="sm"
                      onClick={async () => {
                        const wb = (selectedOrder as OrderWithItems).waybill_number ?? waybillInput;
                        if (!wb?.trim()) {
                          toast({ title: 'Enter waybill number', variant: 'destructive' });
                          return;
                        }
                        try {
                          await updateOrder.mutateAsync({
                            id: selectedOrder.id,
                            updates: { waybill_number: wb.trim(), status: 'for_pickup' },
                          });
                          toast({ title: 'Marked for pickup', description: 'Waybill saved. Status: For pickup.' });
                          setSelectedOrder({
                            ...selectedOrder,
                            waybill_number: wb.trim(),
                            status: 'for_pickup',
                          });
                          setWaybillInput('');
                        } catch (e) {
                          toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
                        }
                      }}
                      disabled={updateOrder.isPending}
                    >
                      Print waybill & mark for pickup
                    </Button>
                  </div>
                  {(selectedOrder as OrderWithItems).waybill_number && (
                    <p className="text-xs text-muted-foreground">Waybill: {(selectedOrder as OrderWithItems).waybill_number}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Set to Paid — reference number required (z-[100] so it appears above order detail modal) */}
      <Dialog open={!!paidRefDialogOrder} onOpenChange={(open) => { if (!open) { setPaidRefDialogOrder(null); setPaidRefInput(''); } }}>
        <DialogContent className="sm:max-w-md z-[100]" overlayClassName="z-[100]">
          <DialogHeader>
            <DialogTitle>Set status to Paid</DialogTitle>
            <DialogDescription>
              Enter the payment reference number before marking this order as Paid.
              {paidRefDialogOrder && ` (Order ${paidRefDialogOrder.order_number})`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input
              placeholder="Reference number"
              value={paidRefInput}
              onChange={(e) => setPaidRefInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), document.getElementById('confirm-paid-ref')?.click())}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPaidRefDialogOrder(null); setPaidRefInput(''); }}>
              Cancel
            </Button>
            <Button
              id="confirm-paid-ref"
              disabled={!paidRefInput.trim() || updateOrder.isPending}
              onClick={async () => {
                if (!paidRefDialogOrder || !paidRefInput.trim()) return;
                const ref = paidRefInput.trim();
                try {
                  await updateOrder.mutateAsync({
                    id: paidRefDialogOrder.id,
                    updates: { status: 'paid', payment_reference_number: ref },
                  });
                  toast({ title: 'Status updated', description: 'Order set to Paid with reference number saved.' });
                  if (selectedOrder?.id === paidRefDialogOrder.id) {
                    setSelectedOrder({ ...selectedOrder, status: 'paid', payment_reference_number: ref });
                  }
                  setPaidRefDialogOrder(null);
                  setPaidRefInput('');
                } catch (e) {
                  toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
                }
              }}
            >
              Confirm & set to Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
