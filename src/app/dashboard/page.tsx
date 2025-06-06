"use client"

import { useState } from "react"
import Image from "next/image"
import { BarChart3, Users, ShoppingBag, DollarSign, TrendingUp, TrendingDown, Package, Clock } from "lucide-react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { orders } from "@/lib/orders"
import { products } from "@/lib/products"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("week")

  // Calculate statistics
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalCustomers = 120 // Example value

  // Recent orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  // Popular products
  const popularProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5)

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          <div className="mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-1">from last {timeRange}</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold">{totalOrders}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+8.2%</span>
                  <span className="text-gray-500 ml-1">from last {timeRange}</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingBag className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <h3 className="text-2xl font-bold">{totalProducts}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-500 font-medium">+5.3%</span>
                  <span className="text-gray-500 ml-1">from last {timeRange}</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                <h3 className="text-2xl font-bold">{totalCustomers}</h3>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="text-red-500 mr-1" size={16} />
                  <span className="text-red-500 font-medium">-2.4%</span>
                  <span className="text-gray-500 ml-1">from last {timeRange}</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Sales Overview</h2>
              <select className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between px-2">
              {/* Simplified bar chart */}
              {[65, 40, 80, 55, 95, 60, 70].map((height, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-8 bg-primary rounded-t-md" style={{ height: `${height}%` }}></div>
                  <span className="text-xs mt-2 text-gray-500">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <a href="/dashboard/orders" className="text-primary text-sm hover:underline">
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
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">#{order.id}</td>
                      <td className="py-3 text-sm">{order.customer || "John Doe"}</td>
                      <td className="py-3 text-sm">{order.date}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-right font-medium">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Popular Products</h2>
              <a href="/dashboard/products" className="text-primary text-sm hover:underline">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {popularProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.rating})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    {product.discount && <span className="text-xs text-green-600 block">-{product.discount}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <a href="#" className="text-primary text-sm hover:underline">
                View All
              </a>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ShoppingBag className="text-green-600" size={20} />
                  </div>
                </div>
                <div>
                  <p className="font-medium">
                    New order <span className="font-semibold">#{orders[0].id}</span> was placed
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock size={14} className="inline mr-1" />
                    30 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="text-blue-600" size={20} />
                  </div>
                </div>
                <div>
                  <p className="font-medium">
                    Product <span className="font-semibold">{products[0].name}</span> is low in stock
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock size={14} className="inline mr-1" />2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="text-purple-600" size={20} />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Monthly sales report is available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock size={14} className="inline mr-1" />5 hours ago
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Users className="text-yellow-600" size={20} />
                  </div>
                </div>
                <div>
                  <p className="font-medium">
                    New customer <span className="font-semibold">Jane Smith</span> registered
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock size={14} className="inline mr-1" />1 day ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
