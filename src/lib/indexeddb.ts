// IndexedDB wrapper utility for FreshKo
// Replaces localStorage with high-capacity IndexedDB storage

export interface DBSchema {
  products: Product[];
  articles: BlogPost[];
  orders: Order[];
  users: User[];
  settings: any[];
  store: any[];
}

export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  isEditable?: boolean;
  createdBy?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  tags: string[];
  isEditable?: boolean;
  createdBy?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: any;
  paymentMethod: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  joinedDate: string;
  address?: string;
}

class IndexedDBManager {
  private dbName = "freshko-main";
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error("IndexedDB failed to open:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("✅ IndexedDB connected successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores for different data types
        const stores = [
          "products",
          "articles",
          "orders",
          "users",
          "settings",
          "store",
        ];

        stores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, {
              keyPath: "id",
              autoIncrement: false,
            });

            // Create indexes for better querying
            if (storeName === "products" || storeName === "articles") {
              store.createIndex("category", "category", { unique: false });
              store.createIndex("title", "title", { unique: false });
            }

            if (storeName === "users") {
              store.createIndex("email", "email", { unique: true });
            }

            if (storeName === "orders") {
              store.createIndex("userId", "userId", { unique: false });
              store.createIndex("status", "status", { unique: false });
            }

            store.createIndex("timestamp", "timestamp", { unique: false });

            console.log(`✅ Created object store: ${storeName}`);
          }
        });
      };
    });
  }

  async setItem(storeName: string, key: string, data: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      const item = {
        id: key,
        data: data,
        timestamp: Date.now(),
      };

      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getItem(storeName: string, key: string): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async removeItem(storeName: string, key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName?: string): Promise<void> {
    if (!this.db) await this.init();

    if (storeName) {
      // Clear specific store
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      // Clear all stores
      const stores = [
        "products",
        "articles",
        "orders",
        "users",
        "settings",
        "store",
      ];
      const promises = stores.map((store) => this.clear(store));
      await Promise.all(promises);
    }
  }

  async getAllKeys(storeName: string): Promise<string[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageEstimate(): Promise<{ usage: number; quota: number }> {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    }
    return { usage: 0, quota: 0 };
  }

  // Migration from localStorage to IndexedDB
  async migrateFromLocalStorage(): Promise<void> {
    console.log("🔄 Starting migration from localStorage to IndexedDB...");

    try {
      // List of localStorage keys to migrate
      const migrations = [
        {
          localKey: "freshko-products",
          storeKey: "freshko-products",
          storeName: "settings",
        },
        {
          localKey: "freshko-articles",
          storeKey: "freshko-articles",
          storeName: "settings",
        },
        {
          localKey: "freshko-orders",
          storeKey: "freshko-orders",
          storeName: "settings",
        },
        {
          localKey: "freshko-users",
          storeKey: "freshko-users",
          storeName: "settings",
        },
        {
          localKey: "freshko-store",
          storeKey: "freshko-store",
          storeName: "store",
        },
      ];

      for (const migration of migrations) {
        const localData = localStorage.getItem(migration.localKey);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            await this.setItem(
              migration.storeName,
              migration.storeKey,
              parsedData
            );
            console.log(`✅ Migrated ${migration.localKey} to IndexedDB`);
          } catch (parseError) {
            console.warn(
              `⚠️ Failed to parse ${migration.localKey}:`,
              parseError
            );
          }
        }
      }

      // Mark migration as complete
      await this.setItem("settings", "migration-completed", true);
      localStorage.setItem("freshko-storage-method", "indexedDB");

      console.log("✅ Migration to IndexedDB completed successfully!");
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  }

  // Check if migration is needed
  async needsMigration(): Promise<boolean> {
    try {
      const migrationCompleted = await this.getItem(
        "settings",
        "migration-completed"
      );
      const storageMethod = localStorage.getItem("freshko-storage-method");

      return !migrationCompleted && storageMethod !== "indexedDB";
    } catch {
      return true; // If we can't check, assume migration is needed
    }
  }
}

// Create singleton instance
export const idbManager = new IndexedDBManager();

// Storage interface that mimics localStorage but uses IndexedDB
export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const data = await idbManager.getItem("settings", key);
      return data ? JSON.stringify(data) : null;
    } catch (error) {
      console.error("Storage getItem error:", error);
      // Fallback to localStorage
      return localStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      const data = JSON.parse(value);
      await idbManager.setItem("settings", key, data);
    } catch (error) {
      console.error("Storage setItem error:", error);
      // Fallback to localStorage
      localStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await idbManager.removeItem("settings", key);
    } catch (error) {
      console.error("Storage removeItem error:", error);
      // Fallback to localStorage
      localStorage.removeItem(key);
    }
  },

  async clear(): Promise<void> {
    try {
      await idbManager.clear();
    } catch (error) {
      console.error("Storage clear error:", error);
      // Fallback to localStorage
      localStorage.clear();
    }
  },
};

// Auto-migrate on first import
if (typeof window !== "undefined") {
  idbManager
    .init()
    .then(async () => {
      if (await idbManager.needsMigration()) {
        console.log("🚀 Auto-migrating to IndexedDB...");
        await idbManager.migrateFromLocalStorage();
        window.dispatchEvent(new CustomEvent("storage-migrated"));
      }
    })
    .catch((error) => {
      console.error(
        "IndexedDB initialization failed, falling back to localStorage:",
        error
      );
    });
}
