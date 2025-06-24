"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHydratedStore } from "@/lib/store";
import { toast } from "sonner";

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const {
    clearCart,
    removeFromWishlist,
    initializeOriginalData,
    getAllProducts,
    getAllArticles,
  } = useHydratedStore();

  const [settings, setSettings] = useState({
    siteName: "FreshKo",
    siteDescription: "Fresh groceries delivered to your door",
    contactEmail: "contact@freshko.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Main Street, City, Country",
    currency: "USD",
    timezone: "UTC",
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    lowStockAlerts: true,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    primaryColor: "#22c55e",
    secondaryColor: "#6b7280",
  });

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllBrowserStorage = async () => {
    setIsClearing(true);

    try {
      // List of all localStorage keys used by the application
      const keysToRemove = [
        // Store data
        "freshko-store",

        // Products and Articles
        "freshko-products",
        "freshko-articles",

        // Orders data
        "freshko-orders",

        // User data
        "freshko-users",

        // Cart and Wishlist (will be handled by store functions)
        // 'cart', 'wishlist' - these are handled by Zustand persist

        // Any other app-specific keys
        "freshko-settings",
        "freshko-theme",
        "freshko-preferences",
      ];

      // Clear specific localStorage keys
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Clear all sessionStorage
      sessionStorage.clear();

      // Clear Zustand persisted state (this includes cart, wishlist, user data)
      if (typeof window !== "undefined") {
        // Clear the main store state
        localStorage.removeItem("freshko-store");

        // Clear any other Zustand stores if they exist
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("freshko-")) {
            localStorage.removeItem(key);
          }
        });
      }

      // Re-initialize original data after clearing
      setTimeout(() => {
        initializeOriginalData();

        // Dispatch events to notify all components to refresh
        window.dispatchEvent(new CustomEvent("storageCleared"));
        window.dispatchEvent(new CustomEvent("productUpdated"));
        window.dispatchEvent(new CustomEvent("articleUpdated"));

        toast.success(
          "All browser storage cleared successfully! Page will reload in 2 seconds."
        );

        // Reload page to reset all state
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 500);
    } catch (error) {
      console.error("Error clearing storage:", error);
      toast.error("Failed to clear browser storage. Please try again.");
    } finally {
      setIsClearing(false);
      setShowClearConfirm(false);
    }
  };

  const getStorageInfo = () => {
    if (typeof window === "undefined")
      return { totalKeys: 0, storageSize: "0 KB" };

    let totalSize = 0;
    let freshkoKeys = 0;

    // Calculate localStorage size
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        if (key.startsWith("freshko-")) {
          freshkoKeys++;
        }
        totalSize += localStorage[key].length + key.length;
      }
    }

    // Convert bytes to readable format
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return {
      totalKeys: freshkoKeys,
      storageSize: formatBytes(totalSize),
    };
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data Management", icon: Database },
  ];

  const storageInfo = getStorageInfo();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your store configuration
            </p>
          </div>
          <button className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Save size={20} />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">General Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) =>
                          handleInputChange("siteName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) =>
                          handleInputChange("contactEmail", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) =>
                          handleInputChange("contactPhone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) =>
                          handleInputChange("currency", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="IDR">IDR - Indonesian Rupiah</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) =>
                        handleInputChange("siteDescription", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={settings.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Database className="text-primary" size={24} />
                    <h2 className="text-lg font-semibold">Data Management</h2>
                  </div>

                  {/* Storage Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-4">
                      Storage Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">
                          FreshKo Keys:
                        </span>
                        <span className="ml-2 text-blue-900">
                          {storageInfo.totalKeys}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Storage Size:
                        </span>
                        <span className="ml-2 text-blue-900">
                          {storageInfo.storageSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Status:
                        </span>
                        <span className="ml-2 text-green-600 font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stored Data Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        User Data
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Shopping Cart Items</li>
                        <li>• Wishlist Products</li>
                        <li>• User Authentication</li>
                        <li>• User Preferences</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Application Data
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Products Database</li>
                        <li>• Articles/Blog Posts</li>
                        <li>• User Created Content</li>
                        <li>• Application Settings</li>
                      </ul>
                    </div>
                  </div>

                  {/* Clear All Data Section */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle
                        className="text-red-500 mt-0.5"
                        size={24}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900 mb-2">
                          Clear All Browser Storage
                        </h3>
                        <p className="text-red-700 text-sm mb-4">
                          This action will permanently delete all stored data
                          including cart items, wishlist, user-created products,
                          articles, and all application settings. Original demo
                          data will be restored.
                        </p>
                        <div className="text-red-700 text-sm mb-4">
                          <strong>What will be cleared:</strong>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Shopping cart items</li>
                            <li>Wishlist products</li>
                            <li>User authentication data</li>
                            <li>Custom products and articles</li>
                            <li>All localStorage and sessionStorage</li>
                            <li>Application preferences</li>
                          </ul>
                        </div>

                        {!showClearConfirm ? (
                          <button
                            onClick={() => setShowClearConfirm(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Clear All Data
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-red-800 font-medium">
                              Are you absolutely sure? This action cannot be
                              undone.
                            </p>
                            <div className="flex gap-3">
                              <button
                                onClick={clearAllBrowserStorage}
                                disabled={isClearing}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isClearing ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                {isClearing
                                  ? "Clearing..."
                                  : "Yes, Clear All Data"}
                              </button>
                              <button
                                onClick={() => setShowClearConfirm(false)}
                                disabled={isClearing}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Reset to Demo Data
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Keep demo products and articles, only clear user data
                      </p>
                      <button
                        onClick={() => {
                          clearCart();
                          // Clear wishlist by removing all items
                          const wishlistItems = getAllProducts().filter((p) =>
                            JSON.parse(
                              localStorage.getItem("freshko-store") || "{}"
                            )?.state?.wishlist?.some((w: any) => w.id === p.id)
                          );
                          wishlistItems.forEach((item) =>
                            removeFromWishlist(item.id)
                          );
                          toast.success(
                            "User data cleared, demo data preserved"
                          );
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Reset User Data Only
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Reload Application
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Refresh the page to ensure all changes take effect
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Reload Page
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            handleInputChange(
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) =>
                            handleInputChange(
                              "smsNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Get notified about new orders
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.orderNotifications}
                          onChange={(e) =>
                            handleInputChange(
                              "orderNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Low Stock Alerts</h3>
                        <p className="text-sm text-gray-500">
                          Get alerted when products are low in stock
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.lowStockAlerts}
                          onChange={(e) =>
                            handleInputChange(
                              "lowStockAlerts",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Security Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500">
                          Put the site in maintenance mode
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) =>
                            handleInputChange(
                              "maintenanceMode",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Allow Registration</h3>
                        <p className="text-sm text-gray-500">
                          Allow new users to register
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.allowRegistration}
                          onChange={(e) =>
                            handleInputChange(
                              "allowRegistration",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Require Email Verification
                        </h3>
                        <p className="text-sm text-gray-500">
                          Require users to verify their email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireEmailVerification}
                          onChange={(e) =>
                            handleInputChange(
                              "requireEmailVerification",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Appearance Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleInputChange("primaryColor", e.target.value)
                          }
                          className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleInputChange("primaryColor", e.target.value)
                          }
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) =>
                            handleInputChange("secondaryColor", e.target.value)
                          }
                          className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) =>
                            handleInputChange("secondaryColor", e.target.value)
                          }
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Upload
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="text-sm text-gray-600 mb-2">
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <span className="text-primary hover:text-primary/80 transition-colors">
                            Upload a file
                          </span>
                          <input
                            id="logo-upload"
                            name="logo-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <span> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
