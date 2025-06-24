"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore } from "@/lib/store";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const hasRedirected = useRef(false);

  const { login, isAuthenticated, user } = useHydratedStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");

  // Redirect if already authenticated (with guard to prevent infinite loop)
  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      hasRedirected.current = true;
      if (user.role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, router]);

  // Check if user was redirected here due to authentication requirement
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingAction = sessionStorage.getItem("pendingAction");
      if (pendingAction) {
        try {
          const action = JSON.parse(pendingAction);
          switch (action.type) {
            case "addToCart":
              setRedirectMessage("Please login to add items to your cart");
              break;
            case "addToWishlist":
              setRedirectMessage("Please login to add items to your wishlist");
              break;
          }
        } catch (error) {
          console.error("Error parsing pending action:", error);
        }
      }
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        toast.success(result.message, {
          description: "Welcome back! Redirecting you now...",
          duration: 2000,
        });

        // Small delay for better UX
        setTimeout(() => {
          hasRedirected.current = true;
          if (data.email === "admin@freshko.com") {
            router.replace("/dashboard");
          } else {
            router.replace("/");
          }
        }, 1000);
      } else {
        toast.error(result.message, {
          description: "Please check your credentials and try again.",
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

  // Don't render form if already authenticated
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Page Header */}
      <div className="mb-8 lg:mb-12 text-center animate-fadeInUp">
        <div className="inline-block p-4 bg-gradient-primary rounded-2xl mb-6 animate-float">
          <Lock size={32} className="text-white" />
        </div>

        <div className="text-center">
          <h1 className="gradient-text text-3xl lg:text-4xl font-bold mb-3">
            Welcome Back
          </h1>
          <p className="text-body mb-8">
            Sign in to your FreshKo account to continue shopping
          </p>

          {/* Show redirect message if user was redirected from cart/wishlist */}
          {redirectMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm font-medium">
                {redirectMessage}
              </p>
            </div>
          )}
        </div>

        <nav className="flex items-center justify-center gap-2 text-small text-gray-500 font-medium">
          <Link
            href="/"
            className="hover:text-primary transition-colors duration-200"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Login</span>
        </nav>
      </div>

      {/* Login Form */}
      <div className="modern-card p-8 animate-slideInUp">
        {/* Demo Credentials */}
        <div className="modern-card p-4 mb-6 border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-primary">Demo Credentials</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-800 mb-1">
                Administrator Access:
              </p>
              <div className="space-y-1 pl-3">
                <p>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    admin@freshko.com
                  </span>{" "}
                  /{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    admin123
                  </span>
                </p>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="font-medium text-gray-800 mb-1">Customer Access:</p>
              <div className="text-gray-600 pl-3 space-y-1">
                <p>• Register for a new account yourself</p>
                <p>• Or login with customers created by admin</p>
                <p className="text-xs text-primary font-medium">
                  (Admin can create customers from dashboard)
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-small font-bold text-gray-700"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail
                size={20}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  errors.email
                    ? "text-red-400"
                    : email
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <input
                {...register("email")}
                type="email"
                id="email"
                className={`modern-input w-full pl-12 pr-4 py-3 font-medium ${
                  errors.email
                    ? "border-red-300 bg-red-50/50"
                    : email
                    ? "border-primary bg-green-50/50"
                    : ""
                }`}
                placeholder="Enter your email address"
              />
              {email && !errors.email && (
                <CheckCircle
                  size={20}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary"
                />
              )}
            </div>
            {errors.email && (
              <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight">
                <AlertCircle size={16} />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-small font-bold text-gray-700"
            >
              Password
            </label>
            <div className="relative group">
              <Lock
                size={20}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  errors.password
                    ? "text-red-400"
                    : password
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className={`modern-input w-full pl-12 pr-12 py-3 font-medium ${
                  errors.password
                    ? "border-red-300 bg-red-50/50"
                    : password
                    ? "border-primary bg-green-50/50"
                    : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1 hover-scale focus-modern"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight">
                <AlertCircle size={16} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              <span className="text-small text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="/account/forgot-password"
              className="text-small text-primary hover:text-primary/80 transition-colors font-semibold hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
              isValid && !isLoading
                ? "btn-primary hover-lift"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-body text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/account/register"
              className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Social Login Divider */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-small">
              <span className="px-6 bg-white text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button type="button" className="btn-secondary hover-lift">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </div>
            </button>

            <button type="button" className="btn-secondary hover-lift">
              <div className="flex items-center justify-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
