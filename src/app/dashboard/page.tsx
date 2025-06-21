"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { orders } from "@/lib/orders";
import { products } from "@/lib/products";

// Sample data for charts
const salesData = [
  { name: "Mon", sales: 4000, orders: 24, revenue: 2400 },
  { name: "Tue", sales: 3000, orders: 18, revenue: 1398 },
  { name: "Wed", sales: 2000, orders: 32, revenue: 9800 },
  { name: "Thu", sales: 2780, orders: 28, revenue: 3908 },
  { name: "Fri", sales: 1890, orders: 35, revenue: 4800 },
  { name: "Sat", sales: 2390, orders: 42, revenue: 3800 },
  { name: "Sun", sales: 3490, orders: 38, revenue: 4300 },
];

const categoryData = [
  { name: "Vegetables", value: 35, color: "#10B981" },
  { name: "Fruits", value: 25, color: "#059669" },
  { name: "Dairy", value: 20, color: "#047857" },
  { name: "Meat", value: 12, color: "#065F46" },
  { name: "Others", value: 8, color: "#064E3B" },
];

const monthlyData = [
  { month: "Jan", revenue: 12000, customers: 145, orders: 89 },
  { month: "Feb", revenue: 15000, customers: 167, orders: 102 },
  { month: "Mar", revenue: 18000, customers: 189, orders: 125 },
  { month: "Apr", revenue: 22000, customers: 201, orders: 148 },
  { month: "May", revenue: 25000, customers: 223, orders: 167 },
  { month: "Jun", revenue: 28000, customers: 245, orders: 189 },
];

// Helper function to get status style
const getStatusStyle = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-green-50 text-green-700";
    case "shipped":
      return "bg-green-200 text-green-800";
    case "cancelled":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("week");

  // Calculate statistics
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = 120; // Example value

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Popular products
  const popularProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          <div className="mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hover:border-gray-300 transition-all duration-300"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-1">
                    from last {timeRange}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors duration-300">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold">{totalOrders}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+8.2%</span>
                  <span className="text-gray-500 ml-1">
                    from last {timeRange}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-200 rounded-lg hover:bg-green-300 transition-colors duration-300">
                <ShoppingBag className="text-green-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <h3 className="text-2xl font-bold">{totalProducts}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+5.3%</span>
                  <span className="text-gray-500 ml-1">
                    from last {timeRange}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                <h3 className="text-2xl font-bold">{totalCustomers}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="text-gray-500 mr-1" size={16} />
                  <span className="text-gray-500 font-medium">-2.4%</span>
                  <span className="text-gray-500 ml-1">
                    from last {timeRange}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                <Users className="text-gray-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Sales Overview - Line Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Sales Overview</h2>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary hover:border-gray-300 transition-all duration-300">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution - Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Category Sales</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Monthly Revenue</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders vs Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Orders vs Customers</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="orders"
                  fill="#10B981"
                  name="Orders"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="customers"
                  fill="#059669"
                  name="Customers"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <a
                href="/dashboard/orders"
                className="text-primary text-sm hover:underline hover:text-green-700 transition-colors duration-300"
              >
                View All
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0 hover:bg-gray-50 transition-colors duration-300"
                    >
                      <td className="py-3 text-sm font-medium">#{order.id}</td>
                      <td className="py-3 text-sm">
                        {order.customer || "John Doe"}
                      </td>
                      <td className="py-3 text-sm">{order.date}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-right font-medium text-primary">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Popular Products</h2>
              <a
                href="/dashboard/products"
                className="text-primary text-sm hover:underline hover:text-green-700 transition-colors duration-300"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 relative overflow-hidden rounded-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? "text-green-500"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.rating})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discount && (
                      <span className="text-xs text-green-600 block">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <a
              href="#"
              className="text-primary text-sm hover:underline hover:text-green-700 transition-colors duration-300"
            >
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors duration-300">
                  <ShoppingBag className="text-green-600" size={20} />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">
                  New order{" "}
                  <span className="font-semibold text-primary">
                    #{orders[0].id}
                  </span>{" "}
                  was placed
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <Clock size={12} className="inline mr-1" />
                  30 minutes ago
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center hover:bg-green-300 transition-colors duration-300">
                  <Package className="text-green-700" size={20} />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">
                  Product{" "}
                  <span className="font-semibold text-primary">
                    {products[0].name}
                  </span>{" "}
                  is low in stock
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <Clock size={12} className="inline mr-1" />2 hours ago
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors duration-300">
                  <BarChart3 className="text-green-600" size={20} />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">
                  Monthly sales report is available
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <Clock size={12} className="inline mr-1" />5 hours ago
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-300">
                  <Users className="text-gray-600" size={20} />
                </div>
              </div>
              <div>
                <p className="font-medium text-sm">
                  New customer{" "}
                  <span className="font-semibold text-primary">Jane Smith</span>{" "}
                  registered
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <Clock size={12} className="inline mr-1" />1 day ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
