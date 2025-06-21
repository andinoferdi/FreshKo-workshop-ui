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

interface StoreState {
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
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      addToCart: (product, quantity = 1) => {
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
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
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
      clearCart: () => set({ cart: [] }),
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
        if (!get().isInWishlist(product.id)) {
          set((state) => ({
            wishlist: [...state.wishlist, product],
          }));
        }
      },
      removeFromWishlist: (productId) => {
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
    }),
    {
      name: "freshko-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);

// Hydration-safe hook
export const useHydratedStore = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return {
      ...store,
      cart: [],
      wishlist: [],
      getCartTotal: () => 0,
      getCartItemsCount: () => 0,
      getWishlistCount: () => 0,
    };
  }

  return store;
};
