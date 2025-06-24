"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, User, Mail, Phone, Shield } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { useHydratedStore } from "@/lib/store";

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "user" | "admin";
}

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [customerFound, setCustomerFound] = useState(true);
  const { getAllUsers, updateUser } = useHydratedStore();

  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user",
  });

  // Load customer data on component mount
  useEffect(() => {
    const users = getAllUsers();
    const customer = users.find((user) => user.id === customerId);

    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        role: customer.role || "user",
      });
      setCustomerFound(true);
    } else {
      setCustomerFound(false);
    }
  }, [customerId, getAllUsers]);

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
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Update user using store function
      const result = await updateUser(customerId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/customers");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!customerFound) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Customer Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The customer you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/dashboard/customers")}
              className="btn-primary"
            >
              Back to Customers
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                Edit Customer
              </h1>
              <p className="text-gray-600 font-medium">
                Update customer information
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      Current Permissions
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

              {/* Save Button */}
              <div className="modern-card p-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {isLoading ? "Updating..." : "Update Customer"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
