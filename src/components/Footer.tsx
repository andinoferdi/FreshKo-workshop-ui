import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <>
      <footer className="py-8 lg:py-12 bg-gray-50">
        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
            {/* Logo and Social */}
            <div className="lg:col-span-2">
              <Image src="/images/logo.png" alt="logo" width={120} height={40} className="mb-6 lg:mb-8" />
              <div className="flex gap-2">
                <Link href="#" className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                  <Facebook size={16} />
                </Link>
                <Link href="#" className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                  <Twitter size={16} />
                </Link>
                <Link href="#" className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                  <Youtube size={16} />
                </Link>
                <Link href="#" className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                  <Instagram size={16} />
                </Link>
              </div>
            </div>

            {/* Ultras */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Ultras</h5>
              <ul className="space-y-1.5 lg:space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Our Journals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Affiliate Programme
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Ultras Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Customer Service</h5>
              <ul className="space-y-1.5 lg:space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Cookie Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Delivery Information
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service 2 */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Customer Service</h5>
              <ul className="space-y-1.5 lg:space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Cookie Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-primary">
                    Delivery Information
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-semibold text-lg mb-4">Subscribe Us</h5>
              <p className="text-gray-600 mb-3 lg:mb-4">
                Subscribe to our newsletter to get updates about our grand offers.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Bottom */}
      <div className="bg-gray-100 py-3 lg:py-4">
        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2023 FreshKo. All rights reserved.</p>
            <p>
              Free HTML Template by{" "}
              <Link href="https://templatesjungle.com/" className="hover:text-primary">
                TemplatesJungle
              </Link>{" "}
              Distributed by{" "}
              <Link href="https://themewagon.com" className="hover:text-primary">
                ThemeWagon
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
