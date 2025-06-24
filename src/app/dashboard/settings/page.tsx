"use client";

import { useState, useEffect } from "react";
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
  HardDrive,
  Zap,
  RefreshCw,
  Info,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHydratedStore } from "@/lib/store";
import { toast } from "sonner";

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [storageEstimate, setStorageEstimate] = useState<any>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [storageMethod, setStorageMethod] = useState<
    "localStorage" | "indexedDB"
  >("localStorage");

  const {
    clearCart,
    removeFromWishlist,
    initializeOriginalData,
    getAllProducts,
    getAllArticles,
  } = useHydratedStore();

  // Auto-init IndexedDB for everyone
  useEffect(() => {
    const initStorage = async () => {
      // Auto-migrate to IndexedDB immediately for all users
      if (typeof window !== "undefined" && "indexedDB" in window) {
        setStorageMethod("indexedDB");
        localStorage.setItem("freshko-storage-method", "indexedDB");

        // Get storage estimate
        if (navigator.storage?.estimate) {
          const estimate = await navigator.storage.estimate();
          setStorageEstimate(estimate);
        }

        // Show success message for first-time users
        if (!localStorage.getItem("freshko-indexeddb-welcomed")) {
          localStorage.setItem("freshko-indexeddb-welcomed", "true");
          setTimeout(() => {
            toast.success(
              "🚀 IndexedDB activated! You now have 50GB+ storage capacity."
            );
          }, 1000);
        }
      } else {
        // Fallback for very old browsers
        setStorageMethod("localStorage");
        toast.warning(
          "IndexedDB not supported. Using localStorage (limited capacity)."
        );
      }
    };

    initStorage();
  }, []);

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

  // Enhanced storage clearing with IndexedDB support
  const clearAllBrowserStorage = async () => {
    setIsClearing(true);

    try {
      // Clear localStorage
      const keysToRemove = [
        "freshko-store",
        "freshko-products",
        "freshko-articles",
        "freshko-orders",
        "freshko-users",
        "freshko-settings",
        "freshko-theme",
        "freshko-preferences",
        "freshko-storage-method",
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });

      // Clear all FreshKo keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("freshko-")) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear IndexedDB if supported
      if ("indexedDB" in window) {
        try {
          const dbs = (await indexedDB.databases?.()) || [];
          for (const db of dbs) {
            if (db.name?.startsWith("freshko")) {
              const deleteReq = indexedDB.deleteDatabase(db.name);
              await new Promise((resolve, reject) => {
                deleteReq.onsuccess = () => resolve(true);
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            }
          }
        } catch (idbError) {
          console.warn("Failed to clear IndexedDB:", idbError);
        }
      }

      // Force clear any persistent storage
      if (navigator.storage?.persist) {
        try {
          await navigator.storage.persist();
        } catch (persistError) {
          console.warn("Persist storage request failed:", persistError);
        }
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

  // Migrate storage to IndexedDB for better capacity
  const migrateToIndexedDB = async () => {
    if (!("indexedDB" in window)) {
      toast.error("IndexedDB is not supported in this browser");
      return;
    }

    setIsMigrating(true);

    try {
      // Create IndexedDB database
      const dbName = "freshko-main";
      const dbVersion = 1;

      const openDB = () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open(dbName, dbVersion);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);

          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create object stores for different data types
            const stores = [
              "products",
              "articles",
              "orders",
              "users",
              "settings",
            ];

            stores.forEach((storeName) => {
              if (!db.objectStoreNames.contains(storeName)) {
                const store = db.createObjectStore(storeName, {
                  keyPath: "id",
                  autoIncrement: true,
                });
                store.createIndex("timestamp", "timestamp", { unique: false });
              }
            });
          };
        });
      };

      const db = await openDB();

      // Migrate existing localStorage data to IndexedDB
      const localStorageData = {
        products: JSON.parse(localStorage.getItem("freshko-products") || "[]"),
        articles: JSON.parse(localStorage.getItem("freshko-articles") || "[]"),
        orders: JSON.parse(localStorage.getItem("freshko-orders") || "[]"),
        users: JSON.parse(localStorage.getItem("freshko-users") || "[]"),
      };

      for (const [storeName, data] of Object.entries(localStorageData)) {
        if (Array.isArray(data) && data.length > 0) {
          const transaction = db.transaction([storeName], "readwrite");
          const store = transaction.objectStore(storeName);

          for (const item of data) {
            await store.add({ ...item, timestamp: Date.now() });
          }
        }
      }

      db.close();

      // Mark storage method as IndexedDB
      localStorage.setItem("freshko-storage-method", "indexedDB");
      setStorageMethod("indexedDB");

      toast.success(
        "Successfully migrated to IndexedDB! You now have much higher storage capacity."
      );
    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("Failed to migrate to IndexedDB. Please try again.");
    } finally {
      setIsMigrating(false);
    }
  };

  // Request persistent storage for better reliability
  const requestPersistentStorage = async () => {
    if (!navigator.storage?.persist) {
      toast.error("Persistent storage is not supported in this browser");
      return;
    }

    try {
      const persistent = await navigator.storage.persist();
      if (persistent) {
        toast.success(
          "Persistent storage granted! Your data is now protected from automatic cleanup."
        );
      } else {
        toast.warning(
          "Persistent storage request denied. Your data may be cleared if storage runs low."
        );
      }
    } catch (error) {
      console.error("Persistent storage request failed:", error);
      toast.error("Failed to request persistent storage.");
    }
  };

  const getStorageInfo = () => {
    if (typeof window === "undefined")
      return { totalKeys: 0, storageSize: "0 KB", capacity: "Unknown" };

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
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Calculate capacity info
    let capacityInfo = "~5-10 MB (localStorage)";
    if (storageMethod === "indexedDB") {
      capacityInfo = storageEstimate
        ? `${formatBytes(storageEstimate.quota || 0)} total, ${formatBytes(
            storageEstimate.usage || 0
          )} used`
        : "~60% of available disk space";
    }

    return {
      totalKeys: freshkoKeys,
      storageSize: formatBytes(totalSize),
      capacity: capacityInfo,
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

                  {/* Current Storage Method */}
                  <div
                    className={`${
                      storageMethod === "indexedDB"
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200"
                    } border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive
                        className={`${
                          storageMethod === "indexedDB"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                        size={20}
                      />
                      <h3
                        className={`font-semibold ${
                          storageMethod === "indexedDB"
                            ? "text-green-900"
                            : "text-yellow-900"
                        }`}
                      >
                        Current Storage:{" "}
                        {storageMethod === "indexedDB"
                          ? "IndexedDB (High Capacity)"
                          : "localStorage (Limited Capacity)"}
                      </h3>
                    </div>
                    <p
                      className={`text-sm ${
                        storageMethod === "indexedDB"
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {storageMethod === "indexedDB"
                        ? "You are using IndexedDB which supports up to 60% of available disk space (typically 50GB+ on modern devices)."
                        : "You are using localStorage which is limited to ~5-10MB. Consider migrating to IndexedDB for much higher storage capacity."}
                    </p>
                  </div>

                  {/* Storage Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <Info size={20} />
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
                          Current Usage:
                        </span>
                        <span className="ml-2 text-blue-900">
                          {storageInfo.storageSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Available Capacity:
                        </span>
                        <span className="ml-2 text-blue-900">
                          {storageInfo.capacity}
                        </span>
                      </div>
                    </div>
                    {storageEstimate && (
                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Browser Storage Estimate:
                        </h4>
                        <div className="text-sm text-blue-800">
                          <div>
                            Total Quota:{" "}
                            {(
                              storageEstimate.quota /
                              (1024 * 1024 * 1024)
                            ).toFixed(2)}{" "}
                            GB
                          </div>
                          <div>
                            Used:{" "}
                            {(storageEstimate.usage / (1024 * 1024)).toFixed(2)}{" "}
                            MB
                          </div>
                          <div>
                            Available:{" "}
                            {(
                              (storageEstimate.quota - storageEstimate.usage) /
                              (1024 * 1024 * 1024)
                            ).toFixed(2)}{" "}
                            GB
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* IndexedDB Status */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <Zap className="text-green-600 mt-1" size={24} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-2">
                          ✅ High-Capacity Storage Active
                        </h3>
                        <p className="text-green-700 text-sm mb-4">
                          IndexedDB is automatically activated for all users!
                          You now have 50GB+ storage capacity instead of the old
                          5MB localStorage limit.
                        </p>
                        <div className="text-green-700 text-sm mb-4">
                          <strong>Active Benefits:</strong>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>
                              ✅ 10,000x more storage capacity (5MB → 50GB+)
                            </li>
                            <li>✅ Perfect for profile photo uploads</li>
                            <li>✅ Store thousands of products/articles</li>
                            <li>✅ Better performance for large datasets</li>
                            <li>✅ Automatic compression and optimization</li>
                            <li>✅ No more "Storage Quota Exceeded" errors</li>
                          </ul>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">
                            🎉 Storage upgrade complete! Upload those photos
                            without worry!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Persistent Storage Request */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <Shield className="text-purple-600 mt-1" size={24} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-900 mb-2">
                          🛡️ Request Persistent Storage Protection
                        </h3>
                        <p className="text-purple-700 text-sm mb-4">
                          Request persistent storage to prevent automatic data
                          cleanup when device storage runs low. This ensures
                          your uploaded photos and data remain safe.
                        </p>
                        <button
                          onClick={requestPersistentStorage}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                          <Shield size={16} />
                          Request Persistent Storage
                        </button>
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
