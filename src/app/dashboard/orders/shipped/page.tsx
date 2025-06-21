"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Eye, MoreHorizontal, CheckCircle, RotateCcw } from "lucide-react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { orders } from "@/lib/orders"

export default function ShippedOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filter only shipped orders
  const shippedOrders = orders.filter((order) => order.status === "shipped")

  const filteredOrders = shippedOrders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const handleStatusChange = (orderId: number, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`)
    alert(`Order #${orderId} status updated to ${newStatus}`)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Shipped Orders</h1>
            <p className="text-gray-600 font-medium">Manage orders that have been shipped to customers</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-lg font-bold text-sm">
              {filteredOrders.length} Shipped
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="modern-card p-6 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shipped orders..."
                className="modern-input w-full pl-12 pr-4 py-3 font-medium"
              />
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Delivery
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
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{order.customer || "Guest"}</div>
                      <div className="text-sm text-gray-500 font-medium">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{order.date}</div>
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
                            <span className="text-xs text-gray-600 font-bold">+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">{order.estimatedDelivery}</div>
                      <div className="text-xs text-gray-500 font-medium">Est. delivery</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-primary">${order.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(order.id, "completed")}
                          className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 font-semibold text-xs"
                        >
                          <CheckCircle size={14} />
                          Delivered
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, "processing")}
                          className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 font-semibold text-xs"
                        >
                          <RotateCcw size={14} />
                          Return
                        </button>
                        <button className="text-gray-600 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
                          <Eye size={16} />
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">No shipped orders found</h3>
              <p className="text-gray-500 font-medium">No orders are currently shipped or try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
