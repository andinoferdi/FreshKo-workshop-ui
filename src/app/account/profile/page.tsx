"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Camera,
  Badge,
  Shield,
  UserCheck,
  Calendar,
  Edit3,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore, type User as StoreUser } from "@/lib/store";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasRedirected = useRef(false);
  const router = useRouter();
  const { user, isAuthenticated, updateProfile } = useHydratedStore();

  // Wait for hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  // Redirect if not authenticated (only after hydration is complete)
  useEffect(() => {
    if (mounted && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/account/login");
    }
  }, [mounted, isAuthenticated, router]);

  // Set form values when user data changes
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
    }
  }, [user, setValue]);

  // Don't render anything during hydration or if not authenticated
  if (!mounted || !isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);

      if (result.success) {
        toast.success("Profile updated successfully!", {
          description: "Your changes have been saved.",
        });
        setIsEditing(false);
        reset(data);
      } else {
        toast.error("Failed to update profile", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (JPG, PNG, etc.)",
      });
      return;
    }

    // Validate file size (max 2MB for better localStorage compatibility)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large", {
        description:
          "Please select an image smaller than 2MB for better performance",
      });
      return;
    }

    setIsUploadingAvatar(true);

    // Compress and create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Create image for compression
      const img = new Image();
      img.onload = () => {
        // Calculate optimal dimensions (max 400x400 for profile photo)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let { width, height } = img;
        const maxSize = 400;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression (0.8 quality for JPEG-like compression)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);

        // Check final size (base64 string length approximates storage size)
        const sizeInBytes = compressedBase64.length * 0.75; // rough base64 to bytes conversion
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB > 1) {
          toast.error("Compressed image still too large", {
            description: "Please try a smaller image or different format",
          });
          setIsUploadingAvatar(false);
          return;
        }

        setAvatarPreview(compressedBase64);

        // Auto-save compressed avatar
        saveAvatar(compressedBase64);
      };

      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const saveAvatar = async (avatarData: string) => {
    try {
      const result = await updateProfile({ avatar: avatarData });

      if (result.success) {
        toast.success("Profile photo updated!", {
          description: "Your new photo has been saved.",
        });
      } else {
        toast.error("Failed to update photo", {
          description: result.message,
        });
        setAvatarPreview(null);
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const result = await updateProfile({ avatar: "" });

      if (result.success) {
        setAvatarPreview(null);
        toast.success("Profile photo removed!", {
          description: "Your photo has been removed.",
        });
      } else {
        toast.error("Failed to remove photo", {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 lg:mb-12 text-center animate-fadeInUp">
        <div className="inline-block p-4 bg-gradient-primary rounded-2xl mb-6 animate-float">
          <User size={32} className="text-white" />
        </div>

        <h1 className="heading-xl gradient-text mb-4">My Profile</h1>

        <p className="text-body text-gray-600 mb-6">
          Manage your account information and preferences
        </p>

        <nav className="flex items-center justify-center gap-2 text-small text-gray-500 font-medium">
          <span>Account</span>
          <span>/</span>
          <span className="text-gray-900">Profile</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="modern-card p-8 text-center animate-slideInLeft h-fit">
            {/* Avatar */}
            <div className="relative inline-block mb-8">
              <div className="relative">
                <img
                  src={avatarPreview || user.avatar || "/images/guest.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-primary/20"
                />
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute bottom-2 right-2 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                title="Change profile photo"
              >
                <Camera size={18} />
              </button>

              {/* Remove Button (show only if has custom avatar) */}
              {((user.avatar && user.avatar !== "/guest.png") ||
                avatarPreview) && (
                <button
                  onClick={removeAvatar}
                  disabled={isUploadingAvatar}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove profile photo"
                >
                  <X size={16} />
                </button>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 font-medium break-all text-sm">
                  {user.email}
                </p>
              </div>

              {/* Role Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-full text-sm font-semibold shadow-lg">
                <Shield size={16} />
                {user.role === "admin" ? "Administrator" : "User"}
              </div>

              {/* Member Since */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                  <Calendar size={16} />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">0</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Orders
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">0</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="modern-card p-8 animate-slideInRight">
            {/* Form Header */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-500">
                  Update your account details and personal information
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="profile-form"
                    disabled={!isDirty || isLoading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isDirty && !isLoading
                        ? "btn-primary hover-lift"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Form Content */}
            <div className="pt-8">
              <form
                id="profile-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Personal Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <UserCheck size={20} className="text-primary" />
                    Personal Information
                  </h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <User
                          size={20}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          {...register("firstName")}
                          type="text"
                          id="firstName"
                          disabled={!isEditing}
                          className={`modern-input w-full pl-12 pr-4 py-3 transition-all duration-200 ${
                            !isEditing
                              ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                              : "hover:border-primary/50 focus:border-primary"
                          } ${
                            errors.firstName
                              ? "border-red-300 bg-red-50/50"
                              : ""
                          }`}
                          placeholder="Enter your first name"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                          <X size={14} />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <User
                          size={20}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          {...register("lastName")}
                          type="text"
                          id="lastName"
                          disabled={!isEditing}
                          className={`modern-input w-full pl-12 pr-4 py-3 transition-all duration-200 ${
                            !isEditing
                              ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                              : "hover:border-primary/50 focus:border-primary"
                          } ${
                            errors.lastName ? "border-red-300 bg-red-50/50" : ""
                          }`}
                          placeholder="Enter your last name"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                          <X size={14} />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Mail size={20} className="text-primary" />
                    Contact Information
                  </h4>

                  <div className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={20}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          {...register("email")}
                          type="email"
                          id="email"
                          disabled={!isEditing}
                          className={`modern-input w-full pl-12 pr-4 py-3 transition-all duration-200 ${
                            !isEditing
                              ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                              : "hover:border-primary/50 focus:border-primary"
                          } ${
                            errors.email ? "border-red-300 bg-red-50/50" : ""
                          }`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                          <X size={14} />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Phone Number
                        <span className="text-gray-400 font-normal ml-2 text-xs">
                          (Optional)
                        </span>
                      </label>
                      <div className="relative">
                        <Phone
                          size={20}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          {...register("phone")}
                          type="tel"
                          id="phone"
                          disabled={!isEditing}
                          className={`modern-input w-full pl-12 pr-4 py-3 transition-all duration-200 ${
                            !isEditing
                              ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                              : "hover:border-primary/50 focus:border-primary"
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Footer - Only show when editing */}
                {isEditing && (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Changes will be saved to your account immediately
                      </p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!isDirty || isLoading}
                          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                            isDirty && !isLoading
                              ? "bg-primary text-white hover:bg-primary/90 hover:scale-105"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <ProfileContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
