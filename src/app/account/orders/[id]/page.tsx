"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Truck,
  Package,
  CheckCircle,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore } from "@/lib/store";
import type { Order } from "@/lib/store";

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const { getOrderById, isAuthenticated } = useHydratedStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = () => {
      if (isAuthenticated) {
        const foundOrder = getOrderById(orderId);
        setOrder(foundOrder || null);
      }
      setIsLoading(false);
    };

    loadOrder();

    // Listen for order updates
    const handleOrderUpdate = () => {
      setTimeout(loadOrder, 100);
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);

    return () => {
      window.removeEventListener("orderUpdated", handleOrderUpdate);
    };
  }, [orderId, getOrderById, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/account/login";
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Prevent flash before redirect
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return notFound();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={20} className="text-green-600" />;
      case "processing":
        return <Clock size={20} className="text-yellow-600" />;
      case "shipped":
        return <Truck size={20} className="text-blue-600" />;
      case "cancelled":
        return <Package size={20} className="text-red-600" />;
      default:
        return <Package size={20} className="text-gray-600" />;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/account/orders"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Orders
              </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Order #{order.id}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Date: {order.date}</span>
                  <span>•</span>
                  <span>{order.items.length} items</span>
                  <span>•</span>
                  <span className="font-semibold text-primary">
                    Total: ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download size={16} />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Items
                </h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.id}`}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Product ID: {item.barang_id}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm text-gray-600">×</span>
                          <span className="text-sm font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        ${order.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {order.shipping === 0
                          ? "Free"
                          : `$${order.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">
                        ${order.tax.toFixed(2)}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold text-green-600">
                          -${order.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-900 mb-1">
                    {order.customer}
                  </p>
                  <p>{order.shippingAddress}</p>
                  {order.phone && <p>Phone: {order.phone}</p>}
                  <p>Email: {order.email}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" />
                  Payment Information
                </h3>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod}
                  </p>
                  <p className="text-green-600 font-medium mt-1">
                    Payment Completed
                  </p>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-primary" />
                  Delivery Information
                </h3>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} />
                    <span>Estimated Delivery:</span>
                  </div>
                  <p className="font-semibold text-gray-900 ml-5">
                    {order.estimatedDelivery || "TBD"}
                  </p>

                  {order.status === "shipped" && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-700 font-medium">
                        Your order has been shipped and is on its way!
                      </p>
                    </div>
                  )}

                  {order.status === "completed" && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-700 font-medium">
                        Order delivered successfully!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        Order Placed
                      </p>
                      <p className="text-gray-600">{order.date}</p>
                    </div>
                  </div>

                  {order.status !== "cancelled" && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          ["processing", "shipped", "completed"].includes(
                            order.status
                          )
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">
                          Processing
                        </p>
                        <p className="text-gray-600">Order being prepared</p>
                      </div>
                    </div>
                  )}

                  {order.status !== "cancelled" && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          ["shipped", "completed"].includes(order.status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">Shipped</p>
                        <p className="text-gray-600">Order shipped to you</p>
                      </div>
                    </div>
                  )}

                  {order.status === "completed" && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">Delivered</p>
                        <p className="text-gray-600">Order delivered</p>
                      </div>
                    </div>
                  )}

                  {order.status === "cancelled" && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">Cancelled</p>
                        <p className="text-gray-600">Order was cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
