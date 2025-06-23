import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

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

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Product[];
  setSearchResults: (results: Product[]) => void;

  // User management functions
  getAllUsers: () => User[];
  deleteUser: (userId: string) => void;
  checkEmailExists: (email: string) => boolean;
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
  const users = localStorage.getItem("freshko-users");
  return users ? JSON.parse(users) : [];
};

const saveUsersToStorage = (users: User[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("freshko-users", JSON.stringify(users));
};

const findUserByEmail = (email: string): User | null => {
  const users = getUsersFromStorage();
  return (
    users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
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
              // In a real app, you'd hash and compare passwords
              // For demo purposes, we'll store password with user data
              const users = getUsersFromStorage();
              const userWithPassword = users.find(
                (u) =>
                  u.email.toLowerCase() === emailLower &&
                  (u as any).password === password
              );

              if (userWithPassword) {
                const user: User = {
                  id: registeredUser.id,
                  firstName: registeredUser.firstName,
                  lastName: registeredUser.lastName,
                  email: registeredUser.email,
                  phone: registeredUser.phone,
                  avatar: registeredUser.avatar,
                  role: "user",
                  createdAt: registeredUser.createdAt,
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
        // Simulate API call with validation
        return new Promise((resolve) => {
          setTimeout(() => {
            const emailLower = userData.email.toLowerCase().trim();

            // Check if email is already taken
            const existingUser = findUserByEmail(emailLower);
            if (existingUser) {
              resolve({
                success: false,
                message:
                  "Email address is already registered. Please use a different email or try logging in.",
              });
              return;
            }

            // Check if trying to register with admin email
            if (emailLower === ADMIN_ACCOUNT.email) {
              resolve({
                success: false,
                message:
                  "This email is reserved for administrators. Please use a different email address.",
              });
              return;
            }

            // Validate password strength
            if (userData.password.length < 6) {
              resolve({
                success: false,
                message: "Password must be at least 6 characters long.",
              });
              return;
            }

            // Create new user
            const newUser: User & { password: string } = {
              id: "user_" + Date.now(),
              firstName: userData.firstName.trim(),
              lastName: userData.lastName.trim(),
              email: emailLower,
              phone: userData.phone?.trim(),
              avatar: userData.avatar,
              role: "user",
              createdAt: new Date().toISOString(),
              password: userData.password, // In real app, this would be hashed
            };

            // Save to localStorage "database"
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
