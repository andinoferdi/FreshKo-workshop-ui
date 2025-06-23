"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  Calendar,
  TrendingUp,
  Package,
  Star,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore } from "@/lib/store";

function AccountDashboard() {
  const [mounted, setMounted] = useState(false);
  const hasRedirected = useRef(false);
  const router = useRouter();
  const { user, isAuthenticated, cart, wishlist } = useHydratedStore();

  // Wait for hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect logic based on user role (only after hydration is complete)
  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/account/login");
    } else if (isAuthenticated && user && !hasRedirected.current) {
      // Regular users should go to profile page, only admins can access account dashboard
      if (user.role !== "admin") {
        hasRedirected.current = true;
        router.replace("/account/profile");
      }
    }
  }, [mounted, isAuthenticated, user, router]);

  // Don't render anything during hydration or if redirecting
  if (!mounted || !isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Admin-specific stats
  const adminStats = [
    {
      label: "Total Users",
      value: "1,247",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: "3,456",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Monthly Revenue",
      value: "$45,678",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Active Products",
      value: "892",
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Admin quick actions
  const adminActions = [
    {
      title: "Dashboard",
      description: "View detailed analytics and reports",
      icon: BarChart3,
      href: "/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Manage Products",
      description: "Add, edit, and organize products",
      icon: Package,
      href: "/dashboard/products",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "User Management",
      description: "View and manage user accounts",
      icon: Users,
      href: "/dashboard/customers",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Order Management",
      description: "Process and track orders",
      icon: ShoppingBag,
      href: "/dashboard/orders",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Content Management",
      description: "Manage blog posts and articles",
      icon: FileText,
      href: "/dashboard/articles",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Settings",
      description: "System preferences and configuration",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const recentActivity = [
    {
      id: "ACT-001",
      action: "New user registered",
      user: "john.doe@email.com",
      time: "2 minutes ago",
      type: "user",
    },
    {
      id: "ACT-002",
      action: "Order completed",
      user: "Order #ORD-3456",
      time: "5 minutes ago",
      type: "order",
    },
    {
      id: "ACT-003",
      action: "Product updated",
      user: "Fresh Bananas",
      time: "10 minutes ago",
      type: "product",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 lg:mb-12 text-center animate-fadeInUp">
        <div className="inline-block p-4 bg-gradient-primary rounded-2xl mb-6 animate-float">
          <Shield size={32} className="text-white" />
        </div>

        <h1 className="heading-xl gradient-text mb-4">Admin Account</h1>

        <p className="text-body text-gray-600 mb-6">
          Welcome back, {user.firstName}! Manage your admin account and system
          overview.
        </p>

        <nav className="flex items-center justify-center gap-2 text-small text-gray-500 font-medium">
          <Link
            href="/"
            className="hover:text-primary transition-colors duration-200"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Admin Account</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Profile Card */}
        <div className="lg:col-span-1">
          <div className="modern-card p-6 text-center animate-slideInLeft">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse-slow">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
            </div>

            {/* User Info */}
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-small text-gray-600 mb-4">{user.email}</p>

            {/* Role Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-primary text-white rounded-full text-small font-medium mb-6">
              <Shield size={14} />
              Administrator
            </div>

            {/* Member Since */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-small text-gray-600">
                <Calendar size={16} />
                Admin since {formatDate(user.createdAt)}
              </div>
            </div>

            {/* Quick Dashboard Link */}
            <Link href="/dashboard" className="btn-primary w-full mt-6">
              <BarChart3 size={18} />
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Admin Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideInRight">
            {adminStats.map((stat, index) => (
              <div key={index} className="modern-card p-4 text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${stat.bgColor}`}
                >
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-small text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="animate-slideInUp">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Admin Tools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="modern-card p-6 hover-lift group"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <action.icon size={24} className={action.color} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-small text-gray-600">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <Link
                href="/dashboard"
                className="text-primary hover:text-primary/80 font-semibold text-small hover:underline transition-colors"
              >
                View All Activity
              </Link>
            </div>

            <div className="modern-card p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-small">
                        {activity.type === "user"
                          ? "U"
                          : activity.type === "order"
                          ? "O"
                          : "P"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {activity.action}
                        </div>
                        <div className="text-small text-gray-600">
                          {activity.user}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-small text-gray-500 font-medium">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Notifications */}
          <div className="animate-slideInUp" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              System Notifications
            </h2>
            <div className="modern-card p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800">
                    System Update Available
                  </h3>
                  <p className="text-small text-blue-700">
                    A new version of the admin dashboard is available for
                    installation.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800">
                    Sales Report Ready
                  </h3>
                  <p className="text-small text-green-700">
                    Your monthly sales report has been generated and is ready
                    for review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <AccountDashboard />
        </div>
      </main>
      <Footer />
    </>
  );
}
