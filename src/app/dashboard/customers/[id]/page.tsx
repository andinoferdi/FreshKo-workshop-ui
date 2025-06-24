"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHydratedStore } from "@/lib/store";
import type { Customer } from "@/lib/customers";
import { customers } from "@/lib/customers";
import { toast } from "sonner";

export default function DashboardCustomerDetailPage() {
  const { id } = useParams();
  const customerId = Number(id);
  const { getAllOrders } = useHydratedStore();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = () => {
      const foundCustomer = customers.find((c) => c.id === customerId);
      setCustomer(foundCustomer || null);

      // Get customer orders
      if (foundCustomer) {
        const allOrders = getAllOrders();
        const orders = allOrders.filter(
          (order) => order.email === foundCustomer.email
        );
        setCustomerOrders(orders);
      }

      setIsLoading(false);
    };

    loadCustomer();

    // Listen for order updates
    const handleOrderUpdate = () => {
      setTimeout(loadCustomer, 100);
    };

    window.addEventListener("orderCreated", handleOrderUpdate);
    window.addEventListener("orderUpdated", handleOrderUpdate);

    return () => {
      window.removeEventListener("orderCreated", handleOrderUpdate);
      window.removeEventListener("orderUpdated", handleOrderUpdate);
    };
  }, [customerId, getAllOrders]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading customer details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return notFound();
  }

  // Calculate customer stats
  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const completedOrders = customerOrders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Customers
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {customer.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Customer ID: {customer.id}</span>
                <span>•</span>
                <span>Joined: {customer.joinedDate}</span>
                <span>•</span>
                <span
                  className={`font-semibold ${
                    customer.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {customer.status === "active"
                    ? "Active"
                    : customer.status === "inactive"
                    ? "Inactive"
                    : "Suspended"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/customers/edit/${customer.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Edit size={16} />
                Edit Customer
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Profile */}
            <div className="modern-card p-6">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src="/guest.png"
                    alt={customer.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${
                      customer.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {customer.name}
                </h3>
                <p className="text-gray-600">{customer.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-red-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">
                      {customer.address || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-purple-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-semibold text-gray-900">
                      {customer.joinedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="modern-card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Customer Statistics
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-blue-500" size={20} />
                    <span className="text-sm font-medium">Total Orders</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {customer.totalOrders}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-green-500" size={20} />
                    <span className="text-sm font-medium">Total Spent</span>
                  </div>
                  <span className="font-bold text-green-600">
                    ${customer.totalSpent.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-purple-500" size={20} />
                    <span className="text-sm font-medium">
                      Avg. Order Value
                    </span>
                  </div>
                  <span className="font-bold text-purple-600">
                    $
                    {customer.totalOrders > 0
                      ? (customer.totalSpent / customer.totalOrders).toFixed(2)
                      : "0.00"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-orange-500" size={20} />
                    <span className="text-sm font-medium">Last Order</span>
                  </div>
                  <span className="font-bold text-orange-600">
                    {customer.lastOrderDate || "Never"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details & Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-900">
                      {customer.name}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{customer.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{customer.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {customer.address || "Not provided"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{customer.joinedDate}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span
                      className={`font-semibold capitalize ${
                        customer.status === "active"
                          ? "text-green-600"
                          : customer.status === "inactive"
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="modern-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Orders ({customerOrders.length})
                </h2>
                {customerOrders.length > 0 && (
                  <Link
                    href="/dashboard/orders"
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    View All Orders
                  </Link>
                )}
              </div>

              {customerOrders.length > 0 ? (
                <div className="space-y-4">
                  {customerOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="text-primary" size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              Order #{order.id}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.date} • {order.items.length} items
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">
                          ${order.total.toFixed(2)}
                        </div>
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="text-sm text-gray-600 hover:text-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-500">
                    This customer hasn't placed any orders yet.
                  </p>
                </div>
              )}
            </div>

            {/* Management Information */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Management Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Customer ID</p>
                    <p className="font-semibold text-gray-900">{customer.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Joined Date</p>
                    <p className="font-semibold text-gray-900">
                      {customer.joinedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <ShoppingBag className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="font-semibold text-gray-900">
                      {customer.totalOrders}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p
                      className={`font-semibold capitalize ${
                        customer.status === "active"
                          ? "text-green-600"
                          : customer.status === "inactive"
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {customer.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
