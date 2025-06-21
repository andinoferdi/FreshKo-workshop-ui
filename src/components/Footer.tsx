import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <>
      <footer className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Logo and Social */}
            <div className="lg:col-span-2">
              <Image src="/images/logo.png" alt="logo" width={140} height={46} className="mb-8 lg:mb-10" />
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="p-3 glass-effect rounded-xl hover:bg-gradient-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Facebook size={18} />
                </Link>
                <Link
                  href="#"
                  className="p-3 glass-effect rounded-xl hover:bg-gradient-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Twitter size={18} />
                </Link>
                <Link
                  href="#"
                  className="p-3 glass-effect rounded-xl hover:bg-gradient-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Youtube size={18} />
                </Link>
                <Link
                  href="#"
                  className="p-3 glass-effect rounded-xl hover:bg-gradient-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Instagram size={18} />
                </Link>
              </div>
            </div>

            {/* About */}
            <div>
              <h5 className="font-bold text-xl mb-6 gradient-text">About</h5>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Our Journals
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Affiliate Programme
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h5 className="font-bold text-xl mb-6 gradient-text">Customer Service</h5>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Cookie Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Delivery Information
                  </Link>
                </li>
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h5 className="font-bold text-xl mb-6 gradient-text">Shop</h5>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/shop"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=fruits"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Fresh Fruits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=vegetables"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Vegetables
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=dairy"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Dairy Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wishlist"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-gray-600 hover:text-primary transition-colors font-medium hover:translate-x-1 transform duration-200 block"
                  >
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-bold text-xl mb-6 gradient-text">Subscribe Us</h5>
              <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                Subscribe to our newsletter to get updates about our grand offers.
              </p>
              <Link href="/contact" className="btn-primary inline-block text-sm shadow-lg hover:shadow-xl">
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Bottom */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p className="font-medium">© 2023 FreshKo. All rights reserved.</p>
            <p className="font-medium">
              Free HTML Template by{" "}
              <Link href="https://templatesjungle.com/" className="hover:text-primary transition-colors font-semibold">
                TemplatesJungle
              </Link>{" "}
              Distributed by{" "}
              <Link href="https://themewagon.com" className="hover:text-primary transition-colors font-semibold">
                ThemeWagon
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
