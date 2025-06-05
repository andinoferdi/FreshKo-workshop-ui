"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Search, Filter, Eye, Download } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { orders } from "@/lib/orders"

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesDate = dateFilter === "all" || filterByDate(order.date, dateFilter)
    return matchesSearch && matchesStatus && matchesDate
  })

  function filterByDate(dateString: string, filter: string) {
    const orderDate = new Date(dateString)
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    switch (filter) {
      case "today":
        return orderDate.toDateString() === today.toDateString()
      case "week":
        return orderDate >= lastWeek
      case "month":
        return orderDate >= lastMonth
      default:
        return true
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 lg:py-12">
        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">My Orders</h1>
            <p className="text-lg text-gray-600 mb-6">Track and manage your order history</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/account" className="hover:text-primary transition-colors">
                Account
              </Link>
              <span>/</span>
              <span className="text-gray-900">Orders</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg md:hidden hover:bg-gray-200 transition-colors"
              >
                <Filter size={20} />
                Filters
              </button>

              <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? "block" : "hidden md:flex"}`}>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none transition-all"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none transition-all"
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
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
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
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Date: {order.date}</span>
                        <span className="mx-2">•</span>
                        <span>{order.items.length} items</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold">Total: ${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                      <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">
                        <Download size={16} />
                        Invoice
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-16 h-16 relative">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <div className="text-sm text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              <span className="mx-2">•</span>
                              <span>${item.price.toFixed(2)} each</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}

                      {order.items.length > 3 && (
                        <div className="text-sm text-gray-600 text-center pt-2 border-t">
                          + {order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-lg text-gray-600 mb-6">Try adjusting your search criteria</p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setDateFilter("all")
                  }}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-semibold transition-colors"
                >
                  Clear Filters
                </button>
                <Link
                  href="/shop"
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 inline-block font-semibold transition-colors"
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
  )
}
