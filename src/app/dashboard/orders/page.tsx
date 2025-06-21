"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { orders } from "@/lib/orders";

export default function DashboardOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesDate =
      dateFilter === "all" || filterByDate(order.date, dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  function filterByDate(dateString: string, filter: string) {
    const orderDate = new Date(dateString);
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case "today":
        return orderDate.toDateString() === today.toDateString();
      case "week":
        return orderDate >= lastWeek;
      case "month":
        return orderDate >= lastMonth;
      default:
        return true;
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-700";
      case "processing":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700";
      case "shipped":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-700";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600";
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Orders</h1>
            <p className="text-gray-600 font-medium">
              Manage customer orders and track deliveries
            </p>
          </div>
          <button className="mt-4 md:mt-0 btn-primary flex items-center gap-2 hover:scale-105 transition-all duration-300">
            <Download size={20} />
            Export Orders
          </button>
        </div>

        {/* Search and Filters */}
        <div className="modern-card p-6 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="modern-input w-full pl-12 pr-4 py-3 font-medium"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 glass-effect rounded-xl md:hidden hover:bg-white/20 transition-all duration-300 font-semibold"
            >
              <Filter size={20} />
              Filters
            </button>

            <div
              className={`flex flex-col md:flex-row gap-4 ${
                showFilters ? "block" : "hidden md:flex"
              }`}
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="modern-input px-4 py-3 font-semibold"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="modern-input px-4 py-3 font-semibold"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="modern-card overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        #{order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {order.customer || "Guest"}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {order.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="relative w-8 h-8">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="rounded-full border-2 border-white object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-bold">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">
                        {order.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-primary">
                        ${order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-600 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 font-medium">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700 font-medium">
              Showing <span className="font-bold">1</span> to{" "}
              <span className="font-bold">
                {Math.min(10, filteredOrders.length)}
              </span>{" "}
              of <span className="font-bold">{filteredOrders.length}</span>{" "}
              results
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm glass-effect rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold">
                Previous
              </button>
              <button className="px-4 py-2 text-sm bg-gradient-primary text-white rounded-lg font-semibold">
                1
              </button>
              <button className="px-4 py-2 text-sm glass-effect rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
