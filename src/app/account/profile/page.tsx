"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { User, Edit3, Save, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    dateOfBirth: "1990-01-15",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
    console.log("Profile updated:", formData);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Account Settings
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Manage your personal information and preferences
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link
                  href="/"
                  className="hover:text-primary transition-colors duration-300"
                >
                  Home
                </Link>
                <span>/</span>
                <Link
                  href="/account"
                  className="hover:text-primary transition-colors duration-300"
                >
                  Account
                </Link>
                <span>/</span>
                <span className="text-gray-900">Profile</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                    <User size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-gray-600">{formData.email}</p>
                </div>

                <nav className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors duration-300">
                    <User size={20} />
                    Profile Settings
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 hover:scale-105 hover:shadow-lg font-semibold transition-all duration-300"
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 hover:scale-105 hover:shadow-lg font-semibold transition-all duration-300"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 hover:shadow-lg font-semibold transition-all duration-300"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {formData.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {formData.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {formData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {formData.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {formData.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {formData.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State & ZIP
                    </label>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="ZIP"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                        />
                      </div>
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {formData.state} {formData.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-300 transition-all duration-300"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors duration-300">
                        {new Date(formData.dateOfBirth).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Stats */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Account Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-6 rounded-xl text-center hover:bg-green-100 hover:scale-105 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-primary mb-2">
                        24
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        Total Orders
                      </div>
                    </div>
                    <div className="bg-green-100 p-6 rounded-xl text-center hover:bg-green-200 hover:scale-105 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-green-700 mb-2">
                        $1,247
                      </div>
                      <div className="text-sm font-semibold text-green-700">
                        Total Spent
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl text-center hover:bg-gray-100 hover:scale-105 transition-all duration-300 cursor-pointer">
                      <div className="text-3xl font-bold text-gray-700 mb-2">
                        8
                      </div>
                      <div className="text-sm font-semibold text-gray-700">
                        Wishlist Items
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
