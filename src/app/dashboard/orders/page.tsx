"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Check,
  X,
  Truck,
  Package,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHydratedStore } from "@/lib/store";
import type { Order } from "@/lib/store";
import { toast } from "sonner";

export default function DashboardOrdersPage() {
  const { getAllOrders, updateOrderStatus } = useHydratedStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Load orders on component mount and when events are triggered
  useEffect(() => {
    const loadOrders = () => {
      const allOrders = getAllOrders();
      setOrders(allOrders);
    };

    loadOrders();

    // Listen for order events
    const handleOrderCreated = () => {
      setTimeout(loadOrders, 100);
    };

    const handleOrderUpdated = () => {
      setTimeout(loadOrders, 100);
    };

    window.addEventListener("orderCreated", handleOrderCreated);
    window.addEventListener("orderUpdated", handleOrderUpdated);

    return () => {
      window.removeEventListener("orderCreated", handleOrderCreated);
      window.removeEventListener("orderUpdated", handleOrderUpdated);
    };
  }, [getAllOrders]);

  // Handle status update
  const handleStatusUpdate = async (
    orderId: number,
    newStatus: Order["status"]
  ) => {
    setIsUpdating(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Refresh orders
        const allOrders = getAllOrders();
        setOrders(allOrders);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item: any) =>
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

  const getStatusActions = (order: Order) => {
    const actions = [];

    switch (order.status) {
      case "processing":
        actions.push({
          label: "Ship",
          icon: Truck,
          status: "shipped" as const,
          color: "text-blue-600 hover:text-blue-700",
        });
        actions.push({
          label: "Cancel",
          icon: X,
          status: "cancelled" as const,
          color: "text-red-600 hover:text-red-700",
        });
        break;
      case "shipped":
        actions.push({
          label: "Complete",
          icon: Check,
          status: "completed" as const,
          color: "text-green-600 hover:text-green-700",
        });
        break;
      case "cancelled":
      case "completed":
        // No actions for final states
        break;
    }

    return actions;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Orders Management
            </h1>
            <p className="text-gray-600 font-medium">
              Manage customer orders and track deliveries ({orders.length} total
              orders)
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
        {filteredOrders.length > 0 ? (
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
                  {filteredOrders.map((order: Order) => (
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
                          {order.items
                            .slice(0, 3)
                            .map((item: any, index: number) => (
                              <div key={index} className="relative w-8 h-8">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="rounded-full border-2 border-white object-cover group-hover:scale-110 transition-all duration-300"
                                />
                              </div>
                            ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          ${order.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* Status Update Actions */}
                          {getStatusActions(order).map((action, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleStatusUpdate(order.id, action.status)
                              }
                              disabled={isUpdating === order.id}
                              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${action.color} disabled:opacity-50`}
                              title={action.label}
                            >
                              {isUpdating === order.id ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <action.icon size={16} />
                              )}
                            </button>
                          ))}

                          {/* View Details */}
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-700"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="modern-card p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Package size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? "No Orders Yet" : "No Orders Found"}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {orders.length === 0
                ? "When customers place orders, they will appear here."
                : "Try adjusting your search criteria or filters."}
            </p>
            {orders.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
