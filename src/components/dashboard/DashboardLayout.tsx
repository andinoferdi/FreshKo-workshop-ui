"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ordersExpanded, setOrdersExpanded] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/products", icon: Package },
    {
      name: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingBag,
      hasSubmenu: true,
      submenu: [
        { name: "Processing", href: "/dashboard/orders/processing", icon: Clock },
        { name: "Shipped", href: "/dashboard/orders/shipped", icon: Truck },
        { name: "Completed", href: "/dashboard/orders/completed", icon: CheckCircle },
        { name: "Cancelled", href: "/dashboard/orders/cancelled", icon: XCircle },
      ],
    },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Articles", href: "/dashboard/articles", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const isOrdersActive = pathname.includes("/dashboard/orders")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 glass-card shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-lg font-bold gradient-text">FreshKo Admin</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="p-6">
              <div className="space-y-3">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const isSubmenuActive = item.submenu?.some((sub) => pathname === sub.href)

                  return (
                    <div key={item.name}>
                      {item.hasSubmenu ? (
                        <>
                          <button
                            onClick={() => setOrdersExpanded(!ordersExpanded)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                              isOrdersActive
                                ? "bg-gradient-primary text-white shadow-lg"
                                : "text-gray-700 hover:bg-white/50 hover:text-primary hover:shadow-md hover:scale-105"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                size={20}
                                className={`transition-all duration-300 ${isOrdersActive ? "" : "group-hover:scale-110"}`}
                              />
                              {item.name}
                            </div>
                            {ordersExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          {ordersExpanded && (
                            <div className="ml-4 mt-2 space-y-2">
                              {item.submenu?.map((subItem) => {
                                const isSubActive = pathname === subItem.href
                                return (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                                      isSubActive
                                        ? "bg-primary/20 text-primary"
                                        : "text-gray-600 hover:bg-white/30 hover:text-primary hover:scale-105"
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <subItem.icon
                                      size={16}
                                      className="group-hover:scale-110 transition-all duration-300"
                                    />
                                    {subItem.name}
                                  </Link>
                                )
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                            isActive
                              ? "bg-gradient-primary text-white shadow-lg"
                              : "text-gray-700 hover:bg-white/50 hover:text-primary hover:shadow-md hover:scale-105"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon
                            size={20}
                            className={`transition-all duration-300 ${isActive ? "" : "group-hover:scale-110"}`}
                          />
                          {item.name}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white/50 hover:text-primary transition-all duration-300 hover:scale-105 group mb-3"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Home size={20} className="group-hover:scale-110 transition-all duration-300" />
                  Back to Store
                </Link>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-300 hover:scale-105 group">
                  <LogOut size={20} className="group-hover:scale-110 transition-all duration-300" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex lg:flex-col">
        <div className="glass-card shadow-2xl h-full">
          <div className="flex items-center p-8 border-b border-white/20">
            <h2 className="text-xl font-bold gradient-text">FreshKo Admin</h2>
          </div>

          <nav className="flex-1 p-6">
            <div className="space-y-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const isSubmenuActive = item.submenu?.some((sub) => pathname === sub.href)

                return (
                  <div key={item.name}>
                    {item.hasSubmenu ? (
                      <>
                        <button
                          onClick={() => setOrdersExpanded(!ordersExpanded)}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                            isOrdersActive
                              ? "bg-gradient-primary text-white shadow-lg"
                              : "text-gray-700 hover:bg-white/50 hover:text-primary hover:shadow-md hover:scale-105"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              size={20}
                              className={`transition-all duration-300 ${isOrdersActive ? "" : "group-hover:scale-110"}`}
                            />
                            {item.name}
                          </div>
                          {ordersExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {ordersExpanded && (
                          <div className="ml-4 mt-2 space-y-2">
                            {item.submenu?.map((subItem) => {
                              const isSubActive = pathname === subItem.href
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                                    isSubActive
                                      ? "bg-primary/20 text-primary"
                                      : "text-gray-600 hover:bg-white/30 hover:text-primary hover:scale-105"
                                  }`}
                                >
                                  <subItem.icon
                                    size={16}
                                    className="group-hover:scale-110 transition-all duration-300"
                                  />
                                  {subItem.name}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                          isActive
                            ? "bg-gradient-primary text-white shadow-lg"
                            : "text-gray-700 hover:bg-white/50 hover:text-primary hover:shadow-md hover:scale-105"
                        }`}
                      >
                        <item.icon
                          size={20}
                          className={`transition-all duration-300 ${isActive ? "" : "group-hover:scale-110"}`}
                        />
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          <div className="p-6 border-t border-white/20">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white/50 hover:text-primary mb-3 transition-all duration-300 hover:scale-105 group"
            >
              <Home size={20} className="group-hover:scale-110 transition-all duration-300" />
              Back to Store
            </Link>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-300 hover:scale-105 group">
              <LogOut size={20} className="group-hover:scale-110 transition-all duration-300" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 glass-card shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold gradient-text">FreshKo Admin</h1>
          <div></div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
