"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Truck,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { orders } from "@/lib/orders";

// Helper function to get status style
const getStatusStyle = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-600";
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

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderId = Number(id);

  const order = orders.find((order) => order.id === orderId);

  if (!order) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Order Details
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              View and track your order progress, items, and delivery
              information
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/account/orders"
                className="hover:text-primary transition-colors"
              >
                Orders
              </Link>
              <span>/</span>
              <span className="text-gray-900">Order #{orderId}</span>
            </div>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order #{order.id}
                </h2>
                <p className="text-gray-500">Placed on {order.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/account/orders"
                  className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 hover:scale-105 text-sm font-medium transition-all duration-300"
                >
                  <ArrowLeft size={16} />
                  Back to Orders
                </Link>
                <button className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 hover:scale-105 hover:shadow-lg text-sm font-medium transition-all duration-300">
                  <Download size={16} />
                  Download Invoice
                </button>
              </div>
            </div>

            {/* Order Status */}
            <div className="border border-gray-100 rounded-xl p-4 mb-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    <Truck size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <p className="font-semibold">
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-semibold">
                      {order.estimatedDelivery || "3-5 business days"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-50 text-green-700">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-semibold">
                      {order.shippingAddress || "123 Main St, City"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-200 text-green-800">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-semibold">
                      {order.paymentMethod || "Credit Card"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            {order.status !== "cancelled" && (
              <div className="mb-6">
                <div className="relative">
                  <div className="flex justify-between mb-2">
                    <div className="text-center">
                      <div
                        className={`w-6 h-6 mx-auto rounded-full border-2 transition-all duration-300 ${
                          ["completed", "processing", "shipped"].includes(
                            order.status
                          )
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <p className="text-xs mt-1">Order Placed</p>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-6 h-6 mx-auto rounded-full border-2 transition-all duration-300 ${
                          order.status === "processing" ||
                          order.status === "shipped" ||
                          order.status === "completed"
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <p className="text-xs mt-1">Processing</p>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-6 h-6 mx-auto rounded-full border-2 transition-all duration-300 ${
                          order.status === "shipped" ||
                          order.status === "completed"
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <p className="text-xs mt-1">Shipped</p>
                    </div>
                    <div className="text-center">
                      <div
                        className={`w-6 h-6 mx-auto rounded-full border-2 transition-all duration-300 ${
                          order.status === "completed"
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <p className="text-xs mt-1">Delivered</p>
                    </div>
                  </div>
                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                  <div
                    className="absolute top-3 left-0 h-0.5 bg-primary -z-10 transition-all duration-700"
                    style={{
                      width:
                        order.status === "completed"
                          ? "100%"
                          : order.status === "shipped"
                          ? "66%"
                          : order.status === "processing"
                          ? "33%"
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Page Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-xl font-semibold">Order Items</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-lg">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 hover:text-primary transition-colors duration-300">
                            {item.name}
                          </h4>
                          <div className="text-sm text-gray-500 mb-2">
                            {item.variant && (
                              <span>Variant: {item.variant}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      ${order.shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">
                      ${order.tax.toFixed(2)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
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

                {/* Shipping Information */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3">Shipping Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Name:</span>{" "}
                      {order.customer || "John Doe"}
                    </p>
                    <p>
                      <span className="text-gray-600">Address:</span>{" "}
                      {order.shippingAddress || "123 Main St, City, Country"}
                    </p>
                    <p>
                      <span className="text-gray-600">Phone:</span>{" "}
                      {order.phone || "(123) 456-7890"}
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span>{" "}
                      {order.email || "customer@example.com"}
                    </p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Method:</span>{" "}
                      {order.paymentMethod || "Credit Card"}
                    </p>
                    {order.paymentMethod === "Credit Card" && (
                      <p>
                        <span className="text-gray-600">Card:</span> **** ****
                        **** 1234
                      </p>
                    )}
                    <p>
                      <span className="text-gray-600">Status:</span>{" "}
                      <span className="text-green-600 font-medium">Paid</span>
                    </p>
                  </div>
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
