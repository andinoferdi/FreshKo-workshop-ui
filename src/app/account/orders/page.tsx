"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search, Filter, Eye, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore } from "@/lib/store";
import type { Order } from "@/lib/store";

export default function OrdersPage() {
  const { getUserOrders, isAuthenticated, user } = useHydratedStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Load orders on component mount and when events are triggered
  useEffect(() => {
    const loadOrders = () => {
      if (isAuthenticated) {
        const userOrders = getUserOrders();
        setOrders(userOrders);
      }
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
  }, [getUserOrders, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/account/login";
    }
  }, [isAuthenticated]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  if (!isAuthenticated) {
    return null; // Prevent flash before redirect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              My Orders
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Track and manage your order history
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/account"
                className="hover:text-primary transition-colors"
              >
                Account
              </Link>
              <span>/</span>
              <span className="text-gray-900">Orders</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           transition-all duration-300 hover:border-gray-300 bg-white"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg 
                         md:hidden hover:bg-gray-50 transition-colors"
              >
                <Filter size={20} />
                Filters
              </button>

              <div
                className={`flex flex-col md:flex-row gap-4 ${
                  showFilters ? "block" : "hidden md:flex"
                }`}
              >
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                             appearance-none transition-all duration-300 hover:border-gray-300 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                             appearance-none transition-all duration-300 hover:border-gray-300 bg-white"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden 
                           hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Date: {order.date}</span>
                        <span className="mx-2">•</span>
                        <span>{order.items.length} items</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold text-primary">
                          Total: ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg 
                                 hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                                       hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Download size={16} />
                        Receipt
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.id}`}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Shipping Address
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Payment & Delivery
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Payment: {order.paymentMethod}</p>
                          <p>Estimated Delivery: {order.estimatedDelivery}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6">
                <Search size={80} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {orders.length === 0 ? "No Orders Yet" : "No Orders Found"}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : "Try adjusting your search criteria or filters."}
              </p>
              {orders.length === 0 && (
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Start Shopping
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
