"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search, User, Heart, Menu, X } from "lucide-react";
import { useHydratedStore, type CartItem } from "../lib/store";
// Dynamic search function will be defined locally
import { useRouter } from "next/navigation";
import { useVisibilityFix } from "@/hooks/useVisibilityFix";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoaded } = useVisibilityFix(20);
  const pathname = usePathname();

  // NextAuth session
  const { data: session, status } = useSession();

  const store = useHydratedStore();
  const {
    cart,
    wishlist,
    user,
    isAuthenticated,
    getCartTotal,
    getCartItemsCount,
    getWishlistCount,
    removeFromCart,
    setSearchQuery: setStoreSearchQuery,
    setSearchResults,
    logout,
    getAllProducts,
    initializeOriginalData,
    searchProducts: storeSearchProducts,
  } = store;
  const router = useRouter();

  const cartTotal = getCartTotal();
  const cartItemsCount = getCartItemsCount();
  const wishlistCount = getWishlistCount();

  // Use search function from store

  // Initialize data on mount
  useEffect(() => {
    initializeOriginalData();
  }, [initializeOriginalData]);

  // Listen for Google profile updates
  useEffect(() => {
    const handleGoogleProfileUpdate = () => {
      console.log("🎯 Header received Google profile update event");
      // Force component re-render by updating a state
      setIsUserMenuOpen(false);
    };

    window.addEventListener(
      "google-profile-updated",
      handleGoogleProfileUpdate
    );
    window.addEventListener("google-user-login", handleGoogleProfileUpdate);

    return () => {
      window.removeEventListener(
        "google-profile-updated",
        handleGoogleProfileUpdate
      );
      window.removeEventListener(
        "google-user-login",
        handleGoogleProfileUpdate
      );
    };
  }, []);

  // Enhanced sync between NextAuth session and FreshKo store
  useEffect(() => {
    // Debug Header state
    console.log("🎯 Header Auth State:", {
      status,
      sessionEmail: session?.user?.email,
      isAuthenticated,
      userExists: !!user,
      userEmail: user?.email,
      userName: user?.firstName,
      userAvatar: user?.avatar,
    });

    if (status === "unauthenticated" && isAuthenticated && user) {
      // NextAuth logged out but FreshKo store still thinks user is logged in
      // Check if user has avatar (Google users typically have profile photos)
      if (user.avatar && user.avatar.includes("googleusercontent.com")) {
        console.log("🔄 Syncing Google logout with FreshKo store");
        logout();
      }
    }

    // Auto-sync Google users when NextAuth session exists but FreshKo doesn't
    if (
      status === "authenticated" &&
      session?.user?.email &&
      !isAuthenticated
    ) {
      console.log(
        "🔄 NextAuth authenticated but FreshKo not - triggering sync"
      );
      // The GoogleUserSync component will handle this automatically
    }
  }, [status, isAuthenticated, user, logout, session?.user?.email]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = storeSearchProducts(searchQuery);
      setStoreSearchQuery(searchQuery);
      setSearchResults(results);
      router.push("/search");
      setIsSearchOpen(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    const results = storeSearchProducts(query);
    setStoreSearchQuery(query);
    setSearchResults(results);
    router.push("/search");
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      router.push("/account/login");
      return;
    }
    setIsCartOpen(true);
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      router.push("/account/login");
      return;
    }
    router.push("/wishlist");
  };

  return (
    <>
      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-primary text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <ShoppingCart size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link
                    href="/shop"
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 transform"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item: CartItem, index) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-3 px-2 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative group">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="rounded-lg group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200"></div>
                          </div>
                          <div>
                            <h6 className="font-medium text-sm text-gray-900 hover:text-primary transition-colors duration-200">
                              {item.name}
                            </h6>
                            <small className="text-gray-500">
                              Qty: {item.quantity}
                            </small>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-900 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="block text-xs text-gray-500 hover:text-gray-700 mt-1 hover:underline transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 font-semibold text-lg">
                    <span>Total</span>
                    <strong className="text-primary">
                      ${cartTotal.toFixed(2)}
                    </strong>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Link
                      href="/cart"
                      className="block w-full bg-gray-100 text-center py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform"
                      onClick={() => setIsCartOpen(false)}
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      className="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Checkout Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Sidebar */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-primary text-lg font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Products
                </h4>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Search
                </h5>
                {["Fruits", "Vegetables", "Dairy", "Meat", "Beverages"].map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() => handleQuickSearch(category)}
                      className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-all duration-200 hover:translate-x-1"
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <header
        className={`bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 transition-all duration-500 ${
          isScrolled ? "shadow-lg bg-white/90" : ""
        } ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-0 opacity-90"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4 lg:py-5">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block group">
                <Image
                  src="/images/logo.png"
                  alt="FreshKo Logo"
                  width={80}
                  height={26}
                  className="h-auto group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form
                onSubmit={handleSearch}
                className="flex w-full modern-input p-0 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border-0 bg-transparent px-6 py-4 text-sm focus:outline-none placeholder-gray-400 font-medium"
                    placeholder="Search for fresh groceries and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-primary text-white hover:shadow-lg transition-all duration-300 hover:scale-105 transform font-medium"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Support Info - Desktop */}
              <div className="hidden xl:block text-right group">
                <span className="text-xs text-gray-500 block group-hover:text-primary transition-colors duration-200 font-medium">
                  Need Help?
                </span>
                <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
                  +1-800-FRESHKO
                </span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="relative group p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 transform flex items-center justify-center"
                    title="My Account"
                  >
                    {isAuthenticated && user ? (
                      <div className="relative">
                        <img
                          src={user.avatar || "/images/guest.png"}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-6 h-6 rounded-full object-cover border border-gray-200"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                      </div>
                    ) : (
                      <User
                        size={20}
                        className="text-gray-600 group-hover:text-primary transition-colors duration-200"
                      />
                    )}
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      {/* Mobile Overlay */}
                      <div
                        className="sm:hidden fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />

                      <div
                        className="absolute top-full mt-3 modern-card z-50 transform transition-all duration-300 scale-100 opacity-100 
                                w-64 right-0 
                                max-sm:fixed max-sm:top-16 max-sm:right-4 max-sm:left-4 max-sm:w-auto max-sm:mx-auto"
                      >
                        <div className="py-2">
                          {isAuthenticated && user ? (
                            <>
                              <div className="px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-xl">
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <img
                                      src={user.avatar || "/images/guest.png"}
                                      alt={`${user.firstName} ${user.lastName}`}
                                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg ring-2 ring-primary/20"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                      Welcome back, {user.firstName}!
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium truncate">
                                      {user.email}
                                    </p>
                                    {user.role === "admin" && (
                                      <span className="inline-block px-2 py-1 mt-2 text-xs bg-purple-100 text-purple-800 rounded-full font-semibold">
                                        <span className="flex items-center gap-1">
                                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                          Administrator
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {user.role !== "admin" && (
                                <Link
                                  href="/account/orders"
                                  className="block px-6 py-3 text-gray-700 hover:bg-gray-50/50 hover:text-primary transition-all duration-200 hover:translate-x-1 font-medium"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Order History
                                </Link>
                              )}
                              {user.role === "admin" && (
                                <Link
                                  href="/dashboard"
                                  className="block px-6 py-3 text-gray-700 hover:bg-gray-50/50 hover:text-primary transition-all duration-200 hover:translate-x-1 font-medium"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Dashboard
                                </Link>
                              )}
                              <div className="border-t border-gray-100/50 my-1"></div>
                              {user.role !== "admin" && (
                                <Link
                                  href="/account/profile"
                                  className="block px-6 py-3 text-gray-700 hover:bg-gray-50/50 hover:text-primary transition-all duration-200 hover:translate-x-1 font-medium"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  Account Settings
                                </Link>
                              )}
                              <button
                                onClick={async () => {
                                  // Check if this is a Google user
                                  if (
                                    user?.avatar &&
                                    user.avatar.includes(
                                      "googleusercontent.com"
                                    )
                                  ) {
                                    // Sign out from both NextAuth and FreshKo store
                                    await signOut({ redirect: false });
                                  }
                                  logout();
                                  setIsUserMenuOpen(false);
                                  router.push("/");
                                }}
                                className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50/50 hover:text-red-700 transition-all duration-200 hover:translate-x-1 font-medium"
                              >
                                Sign Out
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-xl">
                                <p className="text-sm font-semibold text-gray-800">
                                  Welcome to FreshKo!
                                </p>
                                <p className="text-xs text-gray-500 font-medium">
                                  Sign in to your account
                                </p>
                              </div>
                              <Link
                                href="/account/login"
                                className="block px-6 py-3 text-primary hover:bg-gray-50/50 hover:text-primary transition-all duration-200 hover:translate-x-1 font-semibold"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                Sign In
                              </Link>
                              <Link
                                href="/account/register"
                                className="block px-6 py-3 text-gray-700 hover:bg-gray-50/50 hover:text-primary transition-all duration-200 hover:translate-x-1 font-medium"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                Create Account
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  className="relative p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 transform group"
                  onClick={handleWishlistClick}
                  title="Wishlist"
                >
                  <Heart
                    size={20}
                    className="text-gray-600 group-hover:text-primary transition-colors duration-200"
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Mobile Search */}
                <button
                  className="lg:hidden p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 transform group"
                  onClick={() => setIsSearchOpen(true)}
                  title="Search"
                >
                  <Search
                    size={20}
                    className="text-gray-600 group-hover:text-primary transition-colors duration-200"
                  />
                </button>

                {/* Cart Button */}
                <button
                  className="relative p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 transform group"
                  onClick={handleCartClick}
                  title="Shopping Cart"
                >
                  <ShoppingCart
                    size={20}
                    className="text-gray-600 group-hover:text-primary transition-colors duration-200 group-hover:animate-bounce"
                  />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden p-3 glass-effect rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 transform group"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  title="Menu"
                >
                  <Menu
                    size={20}
                    className="text-gray-600 group-hover:text-primary transition-colors duration-200"
                  />
                </button>
              </div>

              {/* Desktop Cart Info */}
              <div
                className="hidden lg:block text-right group cursor-pointer"
                onClick={handleCartClick}
              >
                <span className="block text-xs text-gray-500 group-hover:text-primary transition-colors duration-200 font-medium">
                  Cart ({cartItemsCount} items)
                </span>
                <span className="block text-sm font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden lg:block py-4 border-t border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className={`font-semibold transition-all duration-300 hover:scale-105 transform relative group ${
                    pathname === "/"
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Home
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/shop"
                  className={`font-semibold transition-all duration-300 hover:scale-105 transform relative group ${
                    pathname === "/shop"
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Shop by Departments
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      pathname === "/shop" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/services"
                  className={`font-semibold transition-all duration-300 hover:scale-105 transform relative group ${
                    pathname === "/services"
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Services
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      pathname === "/services"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/about"
                  className={`font-semibold transition-all duration-300 hover:scale-105 transform relative group ${
                    pathname === "/about"
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  About Us
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      pathname === "/about"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/blog"
                  className={`font-semibold transition-all duration-300 hover:scale-105 transform relative group ${
                    pathname === "/blog"
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Blog
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      pathname === "/blog" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
                <Link
                  href="/contact"
                  className={`font-semibold transition-all duration-300 hover:scale-105 transform relative group ${
                    pathname === "/contact"
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Contact
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300 ${
                      pathname === "/contact"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <Image
                  src="/images/logo.png"
                  alt="FreshKo Logo"
                  width={70}
                  height={22}
                  className="h-auto"
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-4">
                <Link
                  href="/"
                  className={`block font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    pathname === "/"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className={`block font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    pathname === "/shop"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop by Departments
                </Link>
                <Link
                  href="/services"
                  className={`block font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    pathname === "/services"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/about"
                  className={`block font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    pathname === "/about"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/blog"
                  className={`block font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    pathname === "/blog"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  className={`block font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    pathname === "/contact"
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Need Help?</p>
                  <p className="text-lg font-semibold text-primary">
                    +1-800-FRESHKO
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
