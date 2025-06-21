import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="py-8 lg:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
            {/* Logo and Social */}
            <div className="lg:col-span-2">
              <Image
                src="/images/logo.png"
                alt="logo"
                width={120}
                height={40}
                className="mb-6 lg:mb-8"
              />
              <div className="flex gap-2">
                <Link
                  href="#"
                  className="p-2 border border-gray-300 rounded hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  <Facebook size={16} />
                </Link>
                <Link
                  href="#"
                  className="p-2 border border-gray-300 rounded hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  <Twitter size={16} />
                </Link>
                <Link
                  href="#"
                  className="p-2 border border-gray-300 rounded hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  <Youtube size={16} />
                </Link>
                <Link
                  href="#"
                  className="p-2 border border-gray-300 rounded hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  <Instagram size={16} />
                </Link>
              </div>
            </div>

            {/* About */}
            <div>
              <h5 className="font-semibold text-lg mb-4 text-gray-900">
                About
              </h5>
              <ul className="space-y-1.5 lg:space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Our Journals
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Affiliate Programme
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h5 className="font-semibold text-lg mb-4 text-gray-900">
                Customer Service
              </h5>
              <ul className="space-y-1.5 lg:space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Cookie Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Delivery Information
                  </Link>
                </li>
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h5 className="font-semibold text-lg mb-4 text-gray-900">Shop</h5>
              <ul className="space-y-1.5 lg:space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=fruits"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Fresh Fruits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=vegetables"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Vegetables
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=dairy"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Dairy Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wishlist"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-semibold text-lg mb-4 text-gray-900">
                Subscribe Us
              </h5>
              <p className="text-gray-600 mb-3 lg:mb-4">
                Subscribe to our newsletter to get updates about our grand
                offers.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium
                         hover:bg-primary/90 transition-colors"
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Bottom */}
      <div className="bg-gray-100 py-3 lg:py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2023 FreshKo. All rights reserved.</p>
            <p>
              Free HTML Template by{" "}
              <Link
                href="https://templatesjungle.com/"
                className="hover:text-primary transition-colors"
              >
                TemplatesJungle
              </Link>{" "}
              Distributed by{" "}
              <Link
                href="https://themewagon.com"
                className="hover:text-primary transition-colors"
              >
                ThemeWagon
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
