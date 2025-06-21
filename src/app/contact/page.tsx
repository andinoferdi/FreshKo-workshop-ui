"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Contact form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Have questions about our products or services? We'd love to hear
              from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900">Contact</span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div
                      className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center
                                  group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20"
                    >
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Address
                      </h3>
                      <p className="text-gray-600">
                        123 Main Street, City, Country 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div
                      className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center
                                  group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20"
                    >
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Phone
                      </h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div
                      className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center
                                  group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20"
                    >
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email
                      </h3>
                      <p className="text-gray-600">contact@freshko.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div
                      className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center
                                  group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20"
                    >
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Business Hours
                      </h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                        <p>Saturday: 9:00 AM - 6:00 PM</p>
                        <p>Sunday: 10:00 AM - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/shop"
                      className="block text-gray-600 hover:text-primary transition-colors py-1"
                    >
                      Shop Products
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block text-gray-600 hover:text-primary transition-colors py-1"
                    >
                      Track Your Order
                    </Link>
                    <Link
                      href="/blog"
                      className="block text-gray-600 hover:text-primary transition-colors py-1"
                    >
                      Read Our Blog
                    </Link>
                    <Link
                      href="/about"
                      className="block text-gray-600 hover:text-primary transition-colors py-1"
                    >
                      About Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all duration-300 hover:border-gray-300"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all duration-300 hover:border-gray-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all duration-300 hover:border-gray-300"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all duration-300 hover:border-gray-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="product">Product Question</option>
                        <option value="delivery">Delivery Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                 transition-all duration-300 hover:border-gray-300 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold 
                             hover:bg-primary/90 hover:scale-105 transition-all duration-300 
                             flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
              <p className="text-gray-600">
                Visit our store or warehouse location
              </p>
            </div>

            <div className="flex justify-center">
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-7xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d349.8248504294586!2d112.67460968333233!3d-7.261726972345004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sid!2sid!4v1750509862705!5m2!1sid!2sid"
                  width="1080"
                  height="600"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-96"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">Quick answers to common questions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                            hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  What are your delivery hours?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We deliver Monday through Sunday from 8 AM to 8 PM. Same-day
                  delivery is available for orders placed before 2 PM.
                </p>
              </div>

              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                            hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  Do you offer organic products?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes! We have a wide selection of organic fruits, vegetables,
                  dairy products, and pantry items from certified organic
                  suppliers.
                </p>
              </div>

              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                            hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  What's your return policy?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We offer a 100% satisfaction guarantee. If you're not happy
                  with any product, contact us within 24 hours for a full refund
                  or replacement.
                </p>
              </div>

              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                            hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  How can I track my order?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Once your order is confirmed, you'll receive a tracking link
                  via email and SMS. You can also check your order status in
                  your account dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
