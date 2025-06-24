"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHydratedStore } from "@/lib/store";
import type { Order } from "@/lib/store";

export default function ProcessingOrdersPage() {
  const { getAllOrders } = useHydratedStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load orders on component mount and when events are triggered
  useEffect(() => {
    const loadOrders = () => {
      const allOrders = getAllOrders();
      const processingOrders = allOrders.filter(
        (order) => order.status === "processing"
      );
      setOrders(processingOrders);
    };

    loadOrders();

    // Listen for order events
    const handleOrderUpdate = () => {
      setTimeout(loadOrders, 100);
    };

    window.addEventListener("orderCreated", handleOrderUpdate);
    window.addEventListener("orderUpdated", handleOrderUpdate);

    return () => {
      window.removeEventListener("orderCreated", handleOrderUpdate);
      window.removeEventListener("orderUpdated", handleOrderUpdate);
    };
  }, [getAllOrders]);

  // Filter orders by search
  const filteredOrders = orders.filter(
    (order: Order) =>
      order.id.toString().includes(searchQuery) ||
      order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Processing Orders
            </h1>
            <p className="text-gray-600 font-medium">
              Orders currently being prepared ({orders.length} orders)
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="modern-card p-6 mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search processing orders..."
              className="modern-input w-full pl-12 pr-4 py-3 font-medium"
            />
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order: Order) => (
              <div
                key={order.id}
                className="modern-card p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    <Clock size={12} />
                    Processing
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p className="font-semibold text-gray-900 mb-1">
                    {order.customer}
                  </p>
                  <p>Date: {order.date}</p>
                  <p>Items: {order.items.length}</p>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="flex -space-x-2 mb-2">
                    {order.items.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="relative w-8 h-8">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="rounded-full border-2 border-white object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {order.items
                      .slice(0, 2)
                      .map((item: any) => item.name)
                      .join(", ")}
                    {order.items.length > 2 && "..."}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-primary">
                    ${order.total.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <Eye size={14} />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="modern-card p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Clock size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? "No Processing Orders" : "No Orders Found"}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {orders.length === 0
                ? "All orders are either completed or in other stages."
                : "Try adjusting your search criteria."}
            </p>
            {orders.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
