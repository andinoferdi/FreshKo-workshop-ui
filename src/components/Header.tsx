"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Search, User, Heart, Menu, X } from "lucide-react"
import { useHydratedStore, type CartItem } from "../lib/store"
import { searchProducts } from "../lib/products"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const {
    cart,
    getCartTotal,
    getCartItemsCount,
    removeFromCart,
    setSearchQuery: setStoreSearchQuery,
    setSearchResults,
  } = useHydratedStore()
  const router = useRouter()

  const cartTotal = getCartTotal()
  const cartItemsCount = getCartItemsCount()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery)
      setStoreSearchQuery(searchQuery)
      setSearchResults(results)
      router.push("/search")
      setIsSearchOpen(false)
    }
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    const results = searchProducts(query)
    setStoreSearchQuery(query)
    setSearchResults(results)
    router.push("/search")
  }

  return (
    <>
      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-primary text-lg font-semibold">Your Cart</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <Link
                  href="/shop"
                  className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80"
                  onClick={() => setIsCartOpen(false)}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                        <div>
                          <h6 className="font-medium text-sm">{item.name}</h6>
                          <small className="text-gray-500">Qty: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-700 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="block text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t font-semibold">
                  <span>Total (USD)</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/cart"
                    className="block w-full bg-gray-100 text-center py-3 rounded-lg font-medium hover:bg-gray-200"
                    onClick={() => setIsCartOpen(false)}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary/80"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Sidebar */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSearchOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-primary text-lg font-semibold">Search</h4>
              <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-0">
                <input
                  className="flex-1 px-4 py-2 bg-gray-100 border-0 rounded-l-lg"
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-dark text-white px-4 py-2 rounded-r-lg" type="submit">
                  Search
                </button>
              </form>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Quick searches:</p>
                <div className="flex flex-wrap gap-2">
                  {["fruits", "vegetables", "dairy", "beverages"].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 capitalize"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 lg:py-4 border-b border-gray-100">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <Image src="/images/logo.png" alt="FreshKo Logo" width={70} height={22} className="h-auto" />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form
                onSubmit={handleSearch}
                className="flex w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="hidden xl:block">
                  <select className="border-0 bg-transparent text-sm px-4 py-3 text-gray-600 focus:outline-none">
                    <option>All Categories</option>
                    <option>Fruits</option>
                    <option>Vegetables</option>
                    <option>Dairy</option>
                    <option>Beverages</option>
                  </select>
                </div>
                <div className="flex-1 border-l border-gray-200">
                  <input
                    type="text"
                    className="w-full border-0 bg-transparent px-4 py-3 text-sm focus:outline-none"
                    placeholder="Search for fresh groceries and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-colors">
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Support Info - Desktop */}
              <div className="hidden xl:block text-right">
                <span className="text-xs text-gray-500 block">Need Help?</span>
                <span className="text-sm font-semibold text-gray-800">+1-800-FRESHKO</span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                    title="My Account"
                  >
                    <User size={20} className="text-gray-600" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">Welcome back!</p>
                          <p className="text-xs text-gray-500">john.doe@email.com</p>
                        </div>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Order History
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Wishlist
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          href="/account/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Account Settings
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/wishlist"
                  className="p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                  title="Wishlist"
                >
                  <Heart size={20} className="text-gray-600" />
                </Link>

                {/* Mobile Search */}
                <button
                  className="lg:hidden p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                  title="Search"
                >
                  <Search size={20} className="text-gray-600" />
                </button>

                {/* Cart Button */}
                <button
                  className="relative p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                  onClick={() => setIsCartOpen(true)}
                  title="Shopping Cart"
                >
                  <ShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  title="Menu"
                >
                  <Menu size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Desktop Cart Info */}
              <div className="hidden lg:block text-right">
                <button className="text-right" onClick={() => setIsCartOpen(true)}>
                  <span className="block text-xs text-gray-500">Cart ({cartItemsCount} items)</span>
                  <span className="block text-sm font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="py-3">
            <div className="flex justify-between items-center">
              <nav className="flex items-center">
                {/* Mobile Menu */}
                {isMenuOpen && (
                  <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold text-gray-800">Navigation</h3>
                          <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                          </button>
                        </div>
                        <div className="space-y-1">
                          <Link
                            href="/"
                            className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Home
                          </Link>
                          <Link
                            href="/shop"
                            className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Shop All Products
                          </Link>
                          <Link
                            href="/services"
                            className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Services
                          </Link>
                          <Link
                            href="/blog"
                            className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Blog & Tips
                          </Link>
                          <Link
                            href="/about"
                            className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            About Us
                          </Link>
                          <Link
                            href="/contact"
                            className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Contact
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-8">
                  <Link
                    href="/shop"
                    className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-primary pb-1"
                  >
                    Shop by Departments
                  </Link>

                  <Link href="/services" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Services
                  </Link>

                  <Link href="/about" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    About Us
                  </Link>

                  <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Blog
                  </Link>

                  <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Contact
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />}
    </>
  )
}
