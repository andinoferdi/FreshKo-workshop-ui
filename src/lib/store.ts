import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type { BlogPost } from "./blog";
import { products as originalProducts } from "./products";
import { blogPosts as originalBlogPosts } from "./blog";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  rating: number;
  description?: string;
  category?: string;
  inStock?: boolean;
  unit?: string;
  isEditable?: boolean;
  createdBy?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: "user" | "admin";
  createdAt: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  barang_id: number; // Product ID reference
}

export interface Order {
  id: number;
  user_id: string; // User ID reference
  date: string;
  status: "processing" | "shipped" | "completed" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  customer: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  paymentMethod: string;
  estimatedDelivery: string;
  createdAt: string;
}

interface StoreState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    userData: Partial<RegisterData>
  ) => Promise<{ success: boolean; message: string }>;

  // Cart state
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Wishlist state
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;

  // Order state
  orders: Order[];
  createOrder: (orderData: {
    items: CartItem[];
    shippingAddress: string;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  }) => Promise<{ success: boolean; message: string; order?: Order }>;
  getUserOrders: () => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (
    orderId: number,
    status: Order["status"]
  ) => Promise<{ success: boolean; message: string }>;
  getOrderById: (id: number) => Order | undefined;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  setSearchResults: (results: Product[]) => void;

  // User management functions
  getAllUsers: () => User[];
  createUser: (
    userData: Omit<User, "id" | "createdAt"> & { password: string }
  ) => Promise<{ success: boolean; message: string }>;
  updateUser: (
    userId: string,
    userData: Partial<User>
  ) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => void;
  checkEmailExists: (email: string) => boolean;

  // Product management functions
  getAllProducts: () => Product[];
  searchProducts: (query: string) => Product[];
  createProduct: (
    productData: Omit<Product, "id" | "isEditable" | "createdBy">
  ) => Promise<{ success: boolean; message: string; product?: Product }>;
  updateProduct: (
    productId: number,
    productData: Partial<Product>
  ) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (
    productId: number
  ) => Promise<{ success: boolean; message: string }>;
  getProductById: (id: number) => Product | undefined;

  // Article management functions
  getAllArticles: () => BlogPost[];
  createArticle: (
    articleData: Omit<BlogPost, "id" | "date" | "isEditable" | "createdBy">
  ) => Promise<{ success: boolean; message: string; article?: BlogPost }>;
  updateArticle: (
    articleId: number,
    articleData: Partial<BlogPost>
  ) => Promise<{ success: boolean; message: string }>;
  deleteArticle: (
    articleId: number
  ) => Promise<{ success: boolean; message: string }>;
  getArticleById: (id: number) => BlogPost | undefined;

  // Data initialization functions
  initializeOriginalData: () => void;

  // Storage management functions
  clearStorageCache: () => void;
  getStorageInfo: () => { used: number; available: number };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
}

// Simulated user database using localStorage
const getUsersFromStorage = (): User[] => {
  if (typeof window === "undefined") return [];

  // Try IndexedDB first for massive storage
  if ("indexedDB" in window) {
    // For now, fallback to localStorage until async loading is implemented
    // TODO: Implement async loading in components
    const users = localStorage.getItem("freshko-users");
    return users ? JSON.parse(users) : [];
  }

  // Fallback to localStorage
  const users = localStorage.getItem("freshko-users");
  return users ? JSON.parse(users) : [];
};

const saveUsersToStorage = (users: User[]): void => {
  if (typeof window === "undefined") return;

  // Always use IndexedDB now - massive storage capacity!
  if ("indexedDB" in window) {
    const dbName = "freshko-main";
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "storageKey" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["users"], "readwrite");
      const store = transaction.objectStore("users");

      store.put({
        storageKey: "freshko-users",
        data: users,
        timestamp: Date.now(),
      });

      db.close();
    };

    request.onerror = () => {
      // Fallback to localStorage with enhanced error handling
      try {
        localStorage.setItem("freshko-users", JSON.stringify(users));
      } catch (error) {
        console.warn("Storage quota exceeded. Unable to save user data.");
      }
    };
  } else {
    // Fallback for very old browsers
    localStorage.setItem("freshko-users", JSON.stringify(users));
  }
};

const findUserByEmail = (email: string): User | null => {
  const users = getUsersFromStorage();
  return (
    users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
};

// Order management functions
const getOrdersFromStorage = (): Order[] => {
  if (typeof window === "undefined") return [];
  const orders = localStorage.getItem("freshko-orders");
  return orders ? JSON.parse(orders) : [];
};

const saveOrdersToStorage = (orders: Order[]): void => {
  if (typeof window === "undefined") return;

  // Use IndexedDB for massive storage capacity!
  if ("indexedDB" in window) {
    const dbName = "freshko-main";
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("orders")) {
        db.createObjectStore("orders", { keyPath: "storageKey" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["orders"], "readwrite");
      const store = transaction.objectStore("orders");

      store.put({
        storageKey: "freshko-orders",
        data: orders,
        timestamp: Date.now(),
      });

      db.close();
    };

    request.onerror = () => {
      // Fallback to localStorage
      try {
        localStorage.setItem("freshko-orders", JSON.stringify(orders));
      } catch (error) {
        console.warn("Storage quota exceeded. Unable to save order data.");
      }
    };
  } else {
    // Fallback for old browsers
    localStorage.setItem("freshko-orders", JSON.stringify(orders));
  }
};

// Pre-defined admin account (like Laravel seeder)
const ADMIN_ACCOUNT = {
  email: "admin@freshko.com",
  password: "admin123",
  firstName: "Admin",
  lastName: "FreshKo",
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call with realistic delay
        return new Promise((resolve) => {
          setTimeout(() => {
            const emailLower = email.toLowerCase().trim();

            // Check for admin account first
            if (
              ADMIN_ACCOUNT.email === emailLower &&
              ADMIN_ACCOUNT.password === password
            ) {
              const user: User = {
                id: "admin_" + Date.now(),
                firstName: ADMIN_ACCOUNT.firstName,
                lastName: ADMIN_ACCOUNT.lastName,
                email: ADMIN_ACCOUNT.email,
                role: "admin",
                createdAt: new Date().toISOString(),
              };
              set({ user, isAuthenticated: true });

              // Process pending action if exists
              if (typeof window !== "undefined") {
                const pendingAction = sessionStorage.getItem("pendingAction");
                if (pendingAction) {
                  try {
                    const action = JSON.parse(pendingAction);
                    sessionStorage.removeItem("pendingAction");

                    // Execute the pending action
                    setTimeout(() => {
                      const store = get();
                      switch (action.type) {
                        case "addToCart":
                          store.addToCart(action.product, action.quantity);
                          break;
                        case "addToWishlist":
                          store.addToWishlist(action.product);
                          break;
                      }
                    }, 100);
                  } catch (error) {
                    console.error("Error processing pending action:", error);
                  }
                }
              }

              resolve({
                success: true,
                message: `Welcome back, ${ADMIN_ACCOUNT.firstName}!`,
              });
              return;
            }

            // Check for registered users
            const registeredUser = findUserByEmail(emailLower);
            if (registeredUser) {
              // In real app, you'd verify password hash
              // For demo, we'll just check if password is not empty
              if (password.trim().length > 0) {
                const userForState: User = {
                  id: registeredUser.id,
                  firstName: registeredUser.firstName,
                  lastName: registeredUser.lastName,
                  email: registeredUser.email,
                  phone: registeredUser.phone,
                  avatar: registeredUser.avatar,
                  role: registeredUser.role || "user",
                  createdAt: registeredUser.createdAt,
                };

                set({ user: userForState, isAuthenticated: true });

                // Process pending action if exists
                if (typeof window !== "undefined") {
                  const pendingAction = sessionStorage.getItem("pendingAction");
                  if (pendingAction) {
                    try {
                      const action = JSON.parse(pendingAction);
                      sessionStorage.removeItem("pendingAction");

                      // Execute the pending action
                      setTimeout(() => {
                        const store = get();
                        switch (action.type) {
                          case "addToCart":
                            store.addToCart(action.product, action.quantity);
                            break;
                          case "addToWishlist":
                            store.addToWishlist(action.product);
                            break;
                        }
                      }, 100);
                    } catch (error) {
                      console.error("Error processing pending action:", error);
                    }
                  }
                }

                resolve({
                  success: true,
                  message: `Welcome back, ${registeredUser.firstName}!`,
                });
                return;
              }
            }

            // If no match found
            resolve({
              success: false,
              message:
                "Invalid email or password. Please check your credentials or register for a new account.",
            });
          }, 1500);
        });
      },
      register: async (userData: RegisterData) => {
        // Simulate API call with realistic delay
        return new Promise((resolve) => {
          setTimeout(() => {
            // Check if email already exists
            if (get().checkEmailExists(userData.email)) {
              resolve({
                success: false,
                message:
                  "An account with this email already exists. Please use a different email or try logging in.",
              });
              return;
            }

            // Check admin email
            if (
              userData.email.toLowerCase() === ADMIN_ACCOUNT.email.toLowerCase()
            ) {
              resolve({
                success: false,
                message:
                  "This email is reserved. Please use a different email address.",
              });
              return;
            }

            // Create new user
            const newUser: User = {
              id:
                "user_" +
                Date.now() +
                "_" +
                Math.random().toString(36).substr(2, 9),
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email.toLowerCase(),
              phone: userData.phone,
              avatar: userData.avatar || "",
              role: "user",
              createdAt: new Date().toISOString(),
            };

            // Save to localStorage
            const users = getUsersFromStorage();
            users.push(newUser);
            saveUsersToStorage(users);

            // Set current user (auto-login after registration)
            const userForState: User = {
              id: newUser.id,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              phone: newUser.phone,
              avatar: newUser.avatar,
              role: newUser.role,
              createdAt: newUser.createdAt,
            };

            set({ user: userForState, isAuthenticated: true });

            // Process pending action if exists
            if (typeof window !== "undefined") {
              const pendingAction = sessionStorage.getItem("pendingAction");
              if (pendingAction) {
                try {
                  const action = JSON.parse(pendingAction);
                  sessionStorage.removeItem("pendingAction");

                  // Execute the pending action
                  setTimeout(() => {
                    const store = get();
                    switch (action.type) {
                      case "addToCart":
                        store.addToCart(action.product, action.quantity);
                        break;
                      case "addToWishlist":
                        store.addToWishlist(action.product);
                        break;
                    }
                  }, 100);
                } catch (error) {
                  console.error("Error processing pending action:", error);
                }
              }
            }

            resolve({
              success: true,
              message: `Welcome to FreshKo, ${userData.firstName}! Your account has been created successfully.`,
            });
          }, 2000);
        });
      },
      logout: () => {
        // Clear cart and wishlist for security
        set({
          user: null,
          isAuthenticated: false,
          cart: [],
          wishlist: [],
        });
      },
      updateProfile: async (userData: Partial<RegisterData>) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const currentUser = get().user;
            if (!currentUser) {
              resolve({ success: false, message: "User not authenticated" });
              return;
            }

            // Update user in localStorage database
            const users = getUsersFromStorage();
            const userIndex = users.findIndex((u) => u.id === currentUser.id);

            if (userIndex === -1) {
              resolve({ success: false, message: "User not found" });
              return;
            }

            // Update user data
            const updatedUserData = { ...users[userIndex] } as any;
            if (userData.firstName)
              updatedUserData.firstName = userData.firstName.trim();
            if (userData.lastName)
              updatedUserData.lastName = userData.lastName.trim();
            if (userData.phone) updatedUserData.phone = userData.phone.trim();
            if (userData.password) updatedUserData.password = userData.password;
            if (userData.avatar !== undefined)
              updatedUserData.avatar = userData.avatar;

            // Check if we're updating avatar and validate storage space
            if (userData.avatar !== undefined && userData.avatar) {
              // Estimate storage usage
              const dataSize = new Blob([JSON.stringify(users)]).size;
              const avatarSize = new Blob([userData.avatar]).size;
              const totalEstimatedSize = dataSize + avatarSize;

              // localStorage limit is ~5MB, but leave buffer
              if (totalEstimatedSize > 4 * 1024 * 1024) {
                resolve({
                  success: false,
                  message:
                    "Storage space insufficient. Please clear browser data or try a smaller image.",
                });
                return;
              }
            }

            try {
              users[userIndex] = updatedUserData;
              saveUsersToStorage(users);

              // Update current user state
              const updatedUser: User = {
                id: updatedUserData.id,
                firstName: updatedUserData.firstName,
                lastName: updatedUserData.lastName,
                email: updatedUserData.email,
                phone: updatedUserData.phone,
                avatar: updatedUserData.avatar,
                role: updatedUserData.role,
                createdAt: updatedUserData.createdAt,
              };

              set({ user: updatedUser });
              resolve({
                success: true,
                message: "Profile updated successfully!",
              });
            } catch (error) {
              resolve({
                success: false,
                message:
                  "Storage quota exceeded. Please clear browser data and try again, or use a smaller image.",
              });
            }
          }, 1000);
        });
      },

      // Cart state
      cart: [],
      addToCart: (product, quantity = 1) => {
        // Check if user is authenticated
        if (!get().isAuthenticated) {
          // Store intended action for after login
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "pendingAction",
              JSON.stringify({
                type: "addToCart",
                product,
                quantity,
              })
            );
            // Show toast notification
            const event = new CustomEvent("show-toast", {
              detail: {
                message: "Please login to add items to your cart",
                type: "info",
              },
            });
            window.dispatchEvent(event);
            window.location.href = "/account/login";
          }
          return;
        }

        const existingItem = get().cart.find((item) => item.id === product.id);
        if (existingItem) {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          set((state) => ({
            cart: [...state.cart, { ...product, quantity }],
          }));
        }
      },
      removeFromCart: (productId) => {
        // Check if user is authenticated
        if (!get().isAuthenticated) {
          if (typeof window !== "undefined") {
            window.location.href = "/account/login";
          }
          return;
        }

        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        // Check if user is authenticated
        if (!get().isAuthenticated) {
          if (typeof window !== "undefined") {
            window.location.href = "/account/login";
          }
          return;
        }

        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => {
        // Check if user is authenticated
        if (!get().isAuthenticated) {
          if (typeof window !== "undefined") {
            window.location.href = "/account/login";
          }
          return;
        }

        set({ cart: [] });
      },
      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const price = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
          return total + price * item.quantity;
        }, 0);
      },
      getCartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      // Wishlist state
      wishlist: [],
      addToWishlist: (product) => {
        // Check if user is authenticated
        if (!get().isAuthenticated) {
          // Store intended action for after login
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "pendingAction",
              JSON.stringify({
                type: "addToWishlist",
                product,
              })
            );
            // Show toast notification
            const event = new CustomEvent("show-toast", {
              detail: {
                message: "Please login to add items to your wishlist",
                type: "info",
              },
            });
            window.dispatchEvent(event);
            window.location.href = "/account/login";
          }
          return;
        }

        if (!get().isInWishlist(product.id)) {
          set((state) => ({
            wishlist: [...state.wishlist, product],
          }));
        }
      },
      removeFromWishlist: (productId) => {
        // Check if user is authenticated
        if (!get().isAuthenticated) {
          if (typeof window !== "undefined") {
            window.location.href = "/account/login";
          }
          return;
        }

        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        }));
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },
      getWishlistCount: () => {
        return get().wishlist.length;
      },

      // Order state
      orders: [],
      createOrder: async (orderData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-orders";
            const storedOrders = localStorage.getItem(storageKey);
            const orders = storedOrders ? JSON.parse(storedOrders) : [];

            // Generate new ID
            const maxId =
              orders.length > 0 ? Math.max(...orders.map((o: any) => o.id)) : 0;

            // Get current user
            const currentUser = get().user;
            if (!currentUser) {
              resolve({
                success: false,
                message: "User must be logged in to create an order",
              });
              return;
            }

            // Create new order
            const newOrder: Order = {
              id: maxId + 1,
              user_id: currentUser.id,
              date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              status: "processing" as const,
              items: orderData.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                barang_id: item.id, // Reference to product ID
              })),
              subtotal: orderData.subtotal,
              shipping: orderData.shipping,
              tax: orderData.tax,
              discount: orderData.discount,
              total: orderData.total,
              customer: `${currentUser.firstName} ${currentUser.lastName}`,
              email: currentUser.email,
              phone: currentUser.phone,
              shippingAddress: orderData.shippingAddress,
              paymentMethod: orderData.paymentMethod,
              estimatedDelivery: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              createdAt: new Date().toISOString(),
            };

            // Save to localStorage
            orders.push(newOrder);
            localStorage.setItem(storageKey, JSON.stringify(orders));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("orderCreated", {
                detail: newOrder,
              })
            );

            resolve({
              success: true,
              message: `Order has been created successfully!`,
              order: newOrder,
            });
          }, 1500);
        });
      },
      getUserOrders: () => {
        const orders = getOrdersFromStorage();
        return orders.filter((o) => o.user_id === get().user?.id);
      },
      getAllOrders: () => {
        return getOrdersFromStorage();
      },
      updateOrderStatus: async (orderId, status) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-orders";
            const storedOrders = localStorage.getItem(storageKey);
            const orders = storedOrders ? JSON.parse(storedOrders) : [];

            const orderIndex = orders.findIndex((o: any) => o.id === orderId);

            if (orderIndex === -1) {
              resolve({
                success: false,
                message: "Order not found.",
              });
              return;
            }

            const existingOrder = orders[orderIndex];

            // Update order data
            const updatedOrder = { ...existingOrder, status };
            orders[orderIndex] = updatedOrder;
            localStorage.setItem(storageKey, JSON.stringify(orders));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("orderUpdated", {
                detail: updatedOrder,
              })
            );

            resolve({
              success: true,
              message: `Order status has been updated successfully!`,
            });
          }, 1500);
        });
      },
      getOrderById: (id) => {
        const orders = getOrdersFromStorage();
        return orders.find((o: any) => o.id === id);
      },

      // Search state
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),

      // User management functions
      getAllUsers: () => {
        return getUsersFromStorage().map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
        }));
      },

      deleteUser: (userId: string) => {
        const users = getUsersFromStorage();
        const filteredUsers = users.filter((user) => user.id !== userId);
        saveUsersToStorage(filteredUsers);
      },

      checkEmailExists: (email: string): boolean => {
        return findUserByEmail(email) !== null;
      },

      createUser: async (userData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const emailLower = userData.email.toLowerCase().trim();

            // Check if email is already taken
            const existingUser = findUserByEmail(emailLower);
            if (existingUser) {
              resolve({
                success: false,
                message:
                  "Email address is already registered. Please use a different email.",
              });
              return;
            }

            // Create new user
            const newUser = {
              id: "user_" + Date.now(),
              firstName: userData.firstName.trim(),
              lastName: userData.lastName.trim(),
              email: emailLower,
              phone: userData.phone?.trim(),
              avatar: userData.avatar,
              role: userData.role || "user",
              createdAt: new Date().toISOString(),
              password: userData.password, // In real app, this would be hashed
            };

            // Save to localStorage "database"
            const users = getUsersFromStorage();
            users.push(newUser);
            saveUsersToStorage(users);

            resolve({
              success: true,
              message: `Customer ${userData.firstName} ${userData.lastName} has been created successfully!`,
            });
          }, 1500);
        });
      },

      updateUser: async (userId, userData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const users = getUsersFromStorage();
            const userIndex = users.findIndex((u) => u.id === userId);

            if (userIndex === -1) {
              resolve({
                success: false,
                message: "User not found.",
              });
              return;
            }

            // If email is being changed, check if it's already taken
            if (userData.email) {
              const emailLower = userData.email.toLowerCase().trim();
              const existingUser = findUserByEmail(emailLower);
              if (existingUser && existingUser.id !== userId) {
                resolve({
                  success: false,
                  message:
                    "Email address is already registered by another user.",
                });
                return;
              }
            }

            // Update user data
            const updatedUser = { ...users[userIndex] };
            if (userData.firstName)
              updatedUser.firstName = userData.firstName.trim();
            if (userData.lastName)
              updatedUser.lastName = userData.lastName.trim();
            if (userData.email)
              updatedUser.email = userData.email.toLowerCase().trim();
            if (userData.phone !== undefined)
              updatedUser.phone = userData.phone?.trim();
            if (userData.avatar !== undefined)
              updatedUser.avatar = userData.avatar;
            if (userData.role) updatedUser.role = userData.role;

            users[userIndex] = updatedUser;
            saveUsersToStorage(users);

            resolve({
              success: true,
              message: `Customer ${updatedUser.firstName} ${updatedUser.lastName} has been updated successfully!`,
            });
          }, 1500);
        });
      },

      // Product management functions
      getAllProducts: () => {
        if (typeof window === "undefined") return [];
        const storageKey = "freshko-products";
        const stored = localStorage.getItem(storageKey);
        const allProducts = stored ? JSON.parse(stored) : [];

        // Ensure we have data - if empty, initialize and try again
        if (allProducts.length === 0) {
          get().initializeOriginalData();
          const reloaded = localStorage.getItem(storageKey);
          const reloadedProducts = reloaded ? JSON.parse(reloaded) : [];
          return reloadedProducts;
        }

        return allProducts;
      },

      searchProducts: (query: string) => {
        if (!query.trim()) return [];

        const allProducts = get().getAllProducts();
        const lowercaseQuery = query.toLowerCase();
        return allProducts.filter(
          (product: any) =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.category?.toLowerCase().includes(lowercaseQuery) ||
            product.description?.toLowerCase().includes(lowercaseQuery)
        );
      },

      createProduct: async (productData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-products";
            const stored = localStorage.getItem(storageKey);
            const products = stored ? JSON.parse(stored) : [];

            // Generate new ID
            const maxId =
              products.length > 0
                ? Math.max(...products.map((p: any) => p.id))
                : 0;

            // Create new product
            const newProduct = {
              ...productData,
              id: maxId + 1,
              isEditable: true, // User-created products are editable
              createdBy: "user",
              rating: productData.rating || 4.0, // Default rating for new products
            };

            // Save to localStorage
            products.push(newProduct);
            localStorage.setItem(storageKey, JSON.stringify(products));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("productCreated", {
                detail: newProduct,
              })
            );

            resolve({
              success: true,
              message: `Product "${productData.name}" has been created successfully!`,
              product: newProduct,
            });
          }, 1500);
        });
      },

      updateProduct: async (productId, productData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-products";
            const stored = localStorage.getItem(storageKey);
            const products = stored ? JSON.parse(stored) : [];

            const productIndex = products.findIndex(
              (p: any) => p.id === productId
            );

            if (productIndex === -1) {
              resolve({
                success: false,
                message: "Product not found.",
              });
              return;
            }

            const existingProduct = products[productIndex];

            // Check if product is editable (protect original data)
            if (
              existingProduct.isEditable === false ||
              existingProduct.createdBy === "original"
            ) {
              resolve({
                success: false,
                message:
                  "This is an original product and cannot be modified. Only user-created products can be edited.",
              });
              return;
            }

            // Update product data
            const updatedProduct = { ...existingProduct, ...productData };
            products[productIndex] = updatedProduct;
            localStorage.setItem(storageKey, JSON.stringify(products));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("productUpdated", {
                detail: updatedProduct,
              })
            );

            resolve({
              success: true,
              message: `Product "${updatedProduct.name}" has been updated successfully!`,
            });
          }, 1500);
        });
      },

      deleteProduct: async (productId) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-products";
            const stored = localStorage.getItem(storageKey);
            const products = stored ? JSON.parse(stored) : [];

            const product = products.find((p: any) => p.id === productId);

            if (!product) {
              resolve({
                success: false,
                message: "Product not found.",
              });
              return;
            }

            // Check if product is editable (protect original data)
            if (
              product.isEditable === false ||
              product.createdBy === "original"
            ) {
              resolve({
                success: false,
                message:
                  "This is an original product and cannot be deleted. Only user-created products can be deleted.",
              });
              return;
            }

            const filteredProducts = products.filter(
              (p: any) => p.id !== productId
            );
            localStorage.setItem(storageKey, JSON.stringify(filteredProducts));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("productDeleted", {
                detail: { id: productId, name: product.name },
              })
            );

            resolve({
              success: true,
              message: `Product "${product.name}" has been deleted successfully!`,
            });
          }, 1000);
        });
      },

      getProductById: (id) => {
        if (typeof window === "undefined") return undefined;
        const storageKey = "freshko-products";
        const stored = localStorage.getItem(storageKey);
        const products = stored ? JSON.parse(stored) : [];
        return products.find((p: any) => p.id === id);
      },

      // Article management functions
      getAllArticles: () => {
        if (typeof window === "undefined") return [];
        const storageKey = "freshko-articles";
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
      },

      createArticle: async (articleData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-articles";
            const stored = localStorage.getItem(storageKey);
            const articles = stored ? JSON.parse(stored) : [];

            // Generate new ID
            const maxId =
              articles.length > 0
                ? Math.max(...articles.map((a: any) => a.id))
                : 0;

            // Create new article
            const newArticle = {
              ...articleData,
              id: maxId + 1,
              isEditable: true, // User-created articles are editable
              createdBy: "user",
              date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            };

            // Save to localStorage
            articles.push(newArticle);
            localStorage.setItem(storageKey, JSON.stringify(articles));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("articleCreated", {
                detail: { article: newArticle },
              })
            );

            resolve({
              success: true,
              message: `Article "${articleData.title}" has been created successfully!`,
              article: newArticle,
            });
          }, 1500);
        });
      },

      updateArticle: async (articleId, articleData) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-articles";
            const stored = localStorage.getItem(storageKey);
            const articles = stored ? JSON.parse(stored) : [];

            const articleIndex = articles.findIndex(
              (a: any) => a.id === articleId
            );

            if (articleIndex === -1) {
              resolve({
                success: false,
                message: "Article not found.",
              });
              return;
            }

            const existingArticle = articles[articleIndex];

            // Check if article is editable (protect original data)
            if (
              existingArticle.isEditable === false ||
              existingArticle.createdBy === "original"
            ) {
              resolve({
                success: false,
                message:
                  "This is an original article and cannot be modified. Only user-created articles can be edited.",
              });
              return;
            }

            // Update article data
            const updatedArticle = { ...existingArticle, ...articleData };
            articles[articleIndex] = updatedArticle;
            localStorage.setItem(storageKey, JSON.stringify(articles));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("articleUpdated", {
                detail: { article: updatedArticle },
              })
            );

            resolve({
              success: true,
              message: `Article "${updatedArticle.title}" has been updated successfully!`,
            });
          }, 1500);
        });
      },

      deleteArticle: async (articleId) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (typeof window === "undefined") {
              resolve({
                success: false,
                message: "Server-side operation not supported",
              });
              return;
            }

            const storageKey = "freshko-articles";
            const stored = localStorage.getItem(storageKey);
            const articles = stored ? JSON.parse(stored) : [];

            const article = articles.find((a: any) => a.id === articleId);

            if (!article) {
              resolve({
                success: false,
                message: "Article not found.",
              });
              return;
            }

            // Check if article is editable (protect original data)
            if (
              article.isEditable === false ||
              article.createdBy === "original"
            ) {
              resolve({
                success: false,
                message:
                  "This is an original article and cannot be deleted. Only user-created articles can be deleted.",
              });
              return;
            }

            const filteredArticles = articles.filter(
              (a: any) => a.id !== articleId
            );
            localStorage.setItem(storageKey, JSON.stringify(filteredArticles));

            // Dispatch custom event to notify components
            window.dispatchEvent(
              new CustomEvent("articleDeleted", {
                detail: { id: articleId, title: article.title },
              })
            );

            resolve({
              success: true,
              message: `Article "${article.title}" has been deleted successfully!`,
            });
          }, 1000);
        });
      },

      getArticleById: (id) => {
        if (typeof window === "undefined") return undefined;
        const storageKey = "freshko-articles";
        const stored = localStorage.getItem(storageKey);
        const articles = stored ? JSON.parse(stored) : [];
        return articles.find((a: any) => a.id === id);
      },

      // Data initialization functions
      initializeOriginalData: () => {
        if (typeof window === "undefined") return;

        // Initialize products
        const productsKey = "freshko-products";
        const storedProducts = localStorage.getItem(productsKey);

        if (!storedProducts) {
          // First time - save original products only
          const protectedProducts = originalProducts.map((product) => ({
            ...product,
            isEditable: false,
            createdBy: "original",
          }));
          localStorage.setItem(productsKey, JSON.stringify(protectedProducts));
        } else {
          // Check if we need to add new original products (in case the original data was updated)
          const existingProducts = JSON.parse(storedProducts);
          const originalIds = originalProducts.map((p) => p.id);
          const existingOriginalIds = existingProducts
            .filter((p: any) => p.createdBy === "original")
            .map((p: any) => p.id);

          // Add any missing original products
          const missingOriginals = originalProducts.filter(
            (p) => !existingOriginalIds.includes(p.id)
          );
          if (missingOriginals.length > 0) {
            const protectedMissing = missingOriginals.map((product) => ({
              ...product,
              isEditable: false,
              createdBy: "original",
            }));
            existingProducts.push(...protectedMissing);
            localStorage.setItem(productsKey, JSON.stringify(existingProducts));
          }
        }

        // Initialize articles
        const articlesKey = "freshko-articles";
        const storedArticles = localStorage.getItem(articlesKey);

        if (!storedArticles) {
          const protectedArticles = originalBlogPosts.map((article) => ({
            ...article,
            isEditable: false,
            createdBy: "original",
          }));
          localStorage.setItem(articlesKey, JSON.stringify(protectedArticles));
        }
      },

      // Storage management functions
      clearStorageCache: () => {
        if (typeof window === "undefined") return;

        // Remove temporary and cache data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.includes("temp") ||
              key.includes("cache") ||
              key.includes("draft"))
          ) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
        });

        console.log(`Cleared ${keysToRemove.length} cache items from storage`);
      },

      getStorageInfo: () => {
        if (typeof window === "undefined") return { used: 0, available: 0 };

        let used = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            used += localStorage[key].length + key.length;
          }
        }

        // Estimate available space (most browsers have ~10MB limit)
        const maxStorage = 10 * 1024 * 1024; // 10MB in bytes
        const available = Math.max(0, maxStorage - used);

        return { used, available };
      },
    }),
    {
      name: "freshko-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: true, // Prevent hydration issues
    }
  )
);

// Improved hydration-safe hook
export const useHydratedStore = () => {
  const store = useStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Immediately mark as hydrated and rehydrate
    setIsHydrated(true);
    useStore.persist.rehydrate();
  }, []);

  // Always return the current store state to prevent blinking
  return store;
};
