"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import ClientOnly from "./ClientOnly";
import ParallaxSection from "./ParallaxSection";
import { useVisibilityFix, useAOSRefresh } from "@/hooks/useVisibilityFix";

export default function HeroSection() {
  const { isLoaded, isVisible } = useVisibilityFix(50);
  const pathname = usePathname();

  // Use the AOS refresh hook
  useAOSRefresh();

  // Scroll to top when navigating to home
  useEffect(() => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <section className="relative bg-gradient-to-br from-white via-green-50/30 to-green-100/50 py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/50 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600 mb-6 border border-primary/20 shadow-sm transform transition-all duration-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-80"
            }`}
            data-aos="fade-down"
            data-aos-duration="800"
            data-aos-once="false"
          >
            <Star className="w-4 h-4 text-primary fill-current" />
            Trusted by 10,000+ customers
          </div>

          {/* Main Heading */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 transform transition-all duration-1000 delay-200 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="false"
          >
            <span className="text-gray-900">Fresh </span>
            <span className="text-primary relative">
              Groceries
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 transform skew-y-1"></div>
            </span>
            <br />
            <span className="text-gray-900">Delivered </span>
            <span className="text-primary">Daily</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
            data-aos-once="false"
          >
            Get farm-fresh groceries delivered to your doorstep within hours.
            Quality guaranteed, prices unbeatable.
          </p>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-8 mb-10 transform transition-all duration-1000 delay-400 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
            data-aos-once="false"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={10000} suffix="+" duration={2000} />
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Happy Customers
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={500} suffix="+" duration={2000} />
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Daily Orders</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={15} suffix="+" duration={2000} />
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Years Experience
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transform transition-all duration-1000 delay-500 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="600"
            data-aos-once="false"
          >
            <Link
              href="/shop"
              className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-primary/25"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <button className="group flex items-center gap-3 text-gray-700 hover:text-primary font-medium text-lg transition-colors duration-300">
              <div className="w-12 h-12 bg-white hover:bg-primary/10 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-primary/20">
                <Play className="w-5 h-5 ml-1 group-hover:scale-110 transition-transform duration-300" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Customer Avatars */}
          <div
            className={`flex items-center justify-center gap-4 transform transition-all duration-1000 delay-600 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="800"
            data-aos-once="false"
          >
            <div className="flex -space-x-2">
              <div className="w-10 h-10 bg-primary/30 rounded-full border-2 border-white"></div>
              <div className="w-10 h-10 bg-primary/50 rounded-full border-2 border-white"></div>
              <div className="w-10 h-10 bg-primary/70 rounded-full border-2 border-white"></div>
              <div className="w-10 h-10 bg-primary rounded-full border-2 border-white"></div>
            </div>
            <span className="text-gray-600 font-medium">
              Join 10k+ happy customers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
