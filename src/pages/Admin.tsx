import { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Settings,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  PackageCheck,
  TruckIcon,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data
const mockOrders = [
  { id: "ORD-001", customer: "Juan Dela Cruz", items: 2, total: 2198, status: "new", date: "2024-01-15", payment: "COD" },
  { id: "ORD-002", customer: "Maria Santos", items: 1, total: 1299, status: "paid", date: "2024-01-15", payment: "GCash" },
  { id: "ORD-003", customer: "Pedro Reyes", items: 3, total: 3097, status: "packed", date: "2024-01-14", payment: "Maya" },
  { id: "ORD-004", customer: "Ana Garcia", items: 1, total: 899, status: "shipped", date: "2024-01-14", payment: "GCash" },
  { id: "ORD-005", customer: "Carlos Mendoza", items: 2, total: 2398, status: "completed", date: "2024-01-13", payment: "COD" },
];

const mockInventory = [
  { sku: "NB-TJ-RB-S", name: "NOBODY Trail Jersey - Red/Black", size: "S", stock: 12, reserved: 2 },
  { sku: "NB-TJ-RB-M", name: "NOBODY Trail Jersey - Red/Black", size: "M", stock: 8, reserved: 3 },
  { sku: "NB-TJ-RB-L", name: "NOBODY Trail Jersey - Red/Black", size: "L", stock: 0, reserved: 0 },
  { sku: "PS-BLK-S", name: "Performance Singlet - Black", size: "S", stock: 15, reserved: 0 },
  { sku: "PS-BLK-M", name: "Performance Singlet - Black", size: "M", stock: 10, reserved: 1 },
  { sku: "ERS-BLK-M", name: "Elite Running Shorts", size: "M", stock: 5, reserved: 2 },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  paid: { label: "Paid", color: "bg-green-100 text-green-800", icon: CheckCircle },
  packed: { label: "Packed", color: "bg-yellow-100 text-yellow-800", icon: PackageCheck },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: TruckIcon },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "New Orders", value: 3, change: "+2 today" },
    { label: "Pending Shipment", value: 5, change: "4 COD" },
    { label: "Low Stock Items", value: 2, change: "Action needed" },
    { label: "Revenue (Today)", value: "₱4,596", change: "+₱1,299" },
  ];

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
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium text-foreground">Admin User</p>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Button variant="red" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          {activeTab === "orders" && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-card p-4 rounded-sm border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
          )}

          {/* Orders Table */}
          {activeTab === "orders" && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Recent Orders</h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order ID</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => {
                    const status = statusConfig[order.status];
                    return (
                      <tr key={order.id} className="border-t border-border hover:bg-secondary/50">
                        <td className="p-4 text-sm font-medium text-foreground">{order.id}</td>
                        <td className="p-4 text-sm text-muted-foreground">{order.customer}</td>
                        <td className="p-4 text-sm text-muted-foreground">{order.items}</td>
                        <td className="p-4 text-sm font-medium text-foreground">₱{order.total.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${order.payment === "COD" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}`}>
                            {order.payment}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Inventory Table */}
          {activeTab === "inventory" && (
            <div className="bg-card rounded-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Inventory by SKU</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="red" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stock
                  </Button>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">SKU</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Size</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">In Stock</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reserved</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Available</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInventory.map((item) => {
                    const available = item.stock - item.reserved;
                    const isLow = available <= 3;
                    const isOut = available === 0;
                    return (
                      <tr key={item.sku} className="border-t border-border hover:bg-secondary/50">
                        <td className="p-4 text-sm font-mono text-foreground">{item.sku}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.name}</td>
                        <td className="p-4 text-sm font-medium text-foreground">{item.size}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.stock}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.reserved}</td>
                        <td className="p-4 text-sm font-medium text-foreground">{available}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            isOut ? "bg-red-100 text-red-800" : isLow ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                          }`}>
                            {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

              <div className="bg-card rounded-sm border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Internal Notes</h3>
                <textarea
                  placeholder="Add notes for team coordination..."
                  className="w-full p-3 bg-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  rows={4}
                />
                <Button variant="default" size="sm" className="mt-3">
                  Save Note
                </Button>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="text-center py-16">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Welcome to REVE Admin</h3>
              <p className="text-muted-foreground">Select a section from the sidebar to manage your store.</p>
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
    </div>
  );
};

export default Admin;
