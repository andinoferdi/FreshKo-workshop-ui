"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search, Filter, Eye, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orders } from "@/lib/orders";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

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
        return "bg-primary/10 text-primary border border-primary/20";
      case "processing":
        return "bg-primary/5 text-primary/80 border border-primary/10";
      case "shipped":
        return "bg-primary/15 text-primary border border-primary/25";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

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
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg 
                                 hover:bg-primary/90 hover:scale-105 text-sm font-medium 
                                 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                      <button
                        className="flex items-center gap-1 px-4 py-2 bg-gray-50 border border-gray-200 
                                       rounded-lg hover:bg-gray-100 hover:border-primary/20 text-sm font-medium 
                                       transition-all duration-300"
                      >
                        <Download size={16} />
                        Invoice
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 group/item"
                        >
                          <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-lg">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover/item:text-primary transition-colors">
                              {item.name}
                            </h4>
                            <div className="text-sm text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              <span className="mx-2">•</span>
                              <span>${item.price.toFixed(2)} each</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {order.items.length > 3 && (
                        <div className="text-sm text-gray-600 text-center pt-4 border-t border-gray-100">
                          <span className="bg-gray-50 px-3 py-1 rounded-full">
                            + {order.items.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Try adjusting your search criteria
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold
                           hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Clear Filters
                </button>
                <Link
                  href="/shop"
                  className="bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-200
                           hover:bg-gray-100 hover:border-primary/20 inline-block font-semibold 
                           transition-all duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
