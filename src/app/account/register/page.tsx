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
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore } from "@/lib/store";
import { toast } from "sonner";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms and Conditions",
    }),
    subscribeNewsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const hasRedirected = useRef(false);
  const router = useRouter();
  const {
    register: registerUser,
    isAuthenticated,
    user,
    login,
    checkEmailExists,
  } = useHydratedStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const watchedPassword = watch("password", "");
  const watchedConfirmPassword = watch("confirmPassword", "");
  const watchedEmail = watch("email", "");

  // Check email availability with debounce
  useEffect(() => {
    if (watchedEmail && watchedEmail.includes("@")) {
      const timer = setTimeout(() => {
        if (checkEmailExists(watchedEmail)) {
          setEmailError(
            "This email is already registered. Please use a different email or try logging in."
          );
        } else {
          setEmailError("");
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setEmailError("");
    }
  }, [watchedEmail, checkEmailExists]);

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

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const getStrengthColor = (strength: number) => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-orange-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-primary";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const onSubmit = async (data: RegisterFormData) => {
    // Check for email availability before submitting
    if (emailError) {
      toast.error("Email validation error", {
        description: emailError,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (result.success) {
        toast.success(result.message, {
          description: "Welcome to FreshKo! You're now signed in.",
          duration: 2000,
        });

        // Auto-login after registration
        await login(data.email, data.password);

        // Small delay for better UX
        setTimeout(() => {
          hasRedirected.current = true;
          router.replace("/");
        }, 1000);
      } else {
        toast.error(result.message, {
          description: "Please check your information and try again.",
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

  // Don't render form if user is already authenticated
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Page Header */}
      <div className="mb-8 lg:mb-12 text-center animate-fadeInUp">
        <div className="inline-block p-4 bg-gradient-primary rounded-2xl mb-6 animate-float">
          <Shield size={32} className="text-white" />
        </div>

        <h1 className="heading-xl gradient-text mb-4">Join FreshKo</h1>

        <p className="text-body text-gray-600 mb-6">
          Create your account and start your fresh grocery journey
        </p>

        <nav className="flex items-center justify-center gap-2 text-small text-gray-500 font-medium">
          <Link
            href="/"
            className="hover:text-primary transition-colors duration-200"
          >
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Register</span>
        </nav>
      </div>

      {/* Registration Form */}
      <div className="modern-card p-8 animate-slideInUp">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-small font-bold text-gray-700"
              >
                First Name
              </label>
              <div className="relative group">
                <User
                  size={20}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    errors.firstName
                      ? "text-red-400"
                      : watch("firstName")
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />
                <input
                  {...register("firstName")}
                  type="text"
                  id="firstName"
                  className={`modern-input w-full pl-12 pr-4 py-3 font-medium ${
                    errors.firstName
                      ? "border-red-300 bg-red-50/50"
                      : watch("firstName")
                      ? "border-primary bg-green-50/50"
                      : ""
                  }`}
                  placeholder="Your first name"
                />
                {watch("firstName") && !errors.firstName && (
                  <CheckCircle
                    size={20}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary"
                  />
                )}
              </div>
              {errors.firstName && (
                <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight">
                  <AlertCircle size={16} />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-small font-bold text-gray-700"
              >
                Last Name
              </label>
              <div className="relative group">
                <User
                  size={20}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    errors.lastName
                      ? "text-red-400"
                      : watch("lastName")
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />
                <input
                  {...register("lastName")}
                  type="text"
                  id="lastName"
                  className={`modern-input w-full pl-12 pr-4 py-3 font-medium ${
                    errors.lastName
                      ? "border-red-300 bg-red-50/50"
                      : watch("lastName")
                      ? "border-primary bg-green-50/50"
                      : ""
                  }`}
                  placeholder="Your last name"
                />
                {watch("lastName") && !errors.lastName && (
                  <CheckCircle
                    size={20}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary"
                  />
                )}
              </div>
              {errors.lastName && (
                <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight">
                  <AlertCircle size={16} />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

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
                  errors.email || emailError
                    ? "text-red-400"
                    : watch("email") && !emailError
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <input
                {...register("email")}
                type="email"
                id="email"
                className={`modern-input w-full pl-12 pr-4 py-3 font-medium ${
                  errors.email || emailError
                    ? "border-red-300 bg-red-50/50"
                    : watch("email") && !emailError
                    ? "border-primary bg-green-50/50"
                    : ""
                }`}
                placeholder="Enter your email address"
              />
              {watch("email") && !errors.email && !emailError && (
                <CheckCircle
                  size={20}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary"
                />
              )}
            </div>
            {(errors.email || emailError) && (
              <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight">
                <AlertCircle size={16} />
                {errors.email?.message || emailError}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-small font-bold text-gray-700"
            >
              Phone Number
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative group">
              <Phone
                size={20}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  watch("phone") ? "text-primary" : "text-gray-400"
                }`}
              />
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                className={`modern-input w-full pl-12 pr-4 py-3 font-medium ${
                  watch("phone") ? "border-primary bg-green-50/50" : ""
                }`}
                placeholder="Enter your phone number"
              />
              {watch("phone") && (
                <CheckCircle
                  size={20}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary"
                />
              )}
            </div>
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
                    : watchedPassword
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
                    : watchedPassword
                    ? "border-primary bg-green-50/50"
                    : ""
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1 hover-scale focus-modern"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {watchedPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-small text-gray-600 font-medium">
                    Password strength:
                  </span>
                  <span
                    className={`text-small font-bold ${
                      passwordStrength < 50 ? "text-red-500" : "text-primary"
                    }`}
                  >
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                      passwordStrength
                    )}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Password must contain:</p>
                  <ul className="grid grid-cols-2 gap-1">
                    <li
                      className={`flex items-center gap-1 ${
                        watchedPassword.length >= 8
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                      8+ characters
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[A-Z]/.test(watchedPassword)
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                      Uppercase letter
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[a-z]/.test(watchedPassword)
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                      Lowercase letter
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[0-9]/.test(watchedPassword)
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      <CheckCircle size={12} />
                      Number
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight">
                <AlertCircle size={16} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-small font-bold text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <Lock
                size={20}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  errors.confirmPassword
                    ? "text-red-400"
                    : watchedConfirmPassword &&
                      watchedConfirmPassword === watchedPassword
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`modern-input w-full pl-12 pr-12 py-3 font-medium ${
                  errors.confirmPassword
                    ? "border-red-300 bg-red-50/50"
                    : watchedConfirmPassword &&
                      watchedConfirmPassword === watchedPassword
                    ? "border-primary bg-green-50/50"
                    : ""
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1 hover-scale focus-modern"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {watchedConfirmPassword &&
              watchedConfirmPassword === watchedPassword &&
              !errors.confirmPassword && (
                <p className="text-primary text-small font-medium flex items-center gap-2">
                  <CheckCircle size={16} />
                  Passwords match
                </p>
              )}
            {errors.confirmPassword && (
              <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight">
                <AlertCircle size={16} />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms and Newsletter */}
          <div className="space-y-4">
            {/* Terms & Conditions */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                {...register("agreedToTerms")}
                type="checkbox"
                className="w-5 h-5 mt-0.5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              <span className="text-small text-gray-700 font-medium group-hover:text-gray-900 transition-colors leading-relaxed">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary/80 transition-colors font-semibold hover:underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary/80 transition-colors font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreedToTerms && (
              <p className="text-red-600 text-small font-medium flex items-center gap-2 animate-slideInRight ml-8">
                <AlertCircle size={16} />
                {errors.agreedToTerms.message}
              </p>
            )}

            {/* Newsletter Subscription */}
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                {...register("subscribeNewsletter")}
                type="checkbox"
                className="w-5 h-5 mt-0.5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              <span className="text-small text-gray-700 font-medium group-hover:text-gray-900 transition-colors leading-relaxed">
                Subscribe to our newsletter for exclusive offers and fresh
                updates
              </span>
            </label>
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
                Create Account
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-body text-gray-600">
            Already have an account?{" "}
            <Link
              href="/account/login"
              className="text-primary hover:text-primary/80 font-bold transition-colors hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Social Registration Divider */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-small">
              <span className="px-6 bg-white text-gray-500 font-medium">
                Or register with
              </span>
            </div>
          </div>

          {/* Social Registration Buttons */}
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

export default function RegisterPage() {
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
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
