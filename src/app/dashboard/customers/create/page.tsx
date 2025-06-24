"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { useHydratedStore } from "@/lib/store";

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  role: "user" | "admin";
  password: string;
}

export default function CreateCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { createUser } = useHydratedStore();
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    role: "user",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password
      ) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Create user using store function
      const result = await createUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        password: formData.password,
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/customers");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    toast.info("Preview functionality coming soon!");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="glass-effect p-3 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Create Customer
              </h1>
              <p className="text-gray-600 font-medium">
                Add a new customer to your system
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="btn-secondary flex items-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <Eye size={16} />
              Preview
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="text-primary" size={24} />
                Personal Information
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Mail className="text-primary" size={24} />
                Contact Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                    placeholder="Enter password"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 6 characters required
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MapPin className="text-primary" size={24} />
                Address Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="text-primary" size={24} />
                Account Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Default Permissions
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {formData.role === "admin" ? (
                      <>
                        <li>• Full dashboard access</li>
                        <li>• Manage products & customers</li>
                        <li>• View all orders & analytics</li>
                        <li>• System administration</li>
                      </>
                    ) : (
                      <>
                        <li>• Browse products</li>
                        <li>• Place orders</li>
                        <li>• Manage profile</li>
                        <li>• View order history</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="text-primary" size={24} />
                Account Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div>
                    <span className="font-bold text-green-900">Active</span>
                    <p className="text-sm text-green-700">
                      Account will be immediately active
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Created:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Last Login:</strong> Never
                  </p>
                  <p>
                    <strong>Status:</strong> New Account
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isLoading ? "Creating..." : "Create Customer"}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Customer will receive a welcome email with login instructions
              </p>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
