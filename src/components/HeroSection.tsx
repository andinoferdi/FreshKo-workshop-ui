"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Play, Star } from "lucide-react"
import AnimatedCounter from "./AnimatedCounter"
import { useVisibilityFix, useAOSRefresh } from "@/hooks/useVisibilityFix"

export default function HeroSection() {
  const { isLoaded, isVisible } = useVisibilityFix(50)
  const pathname = usePathname()

  // Use the AOS refresh hook
  useAOSRefresh()

  // Scroll to top when navigating to home
  useEffect(() => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [pathname])

  return (
    <section className="relative bg-gradient-to-br from-white via-green-50/20 to-green-100/30 py-20 lg:py-32 overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-dot-pattern"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Modern Trust Badge */}
          <div
            className={`inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full text-sm font-semibold text-gray-600 mb-8 shadow-lg transform transition-all duration-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-80"
            }`}
            data-aos="fade-down"
            data-aos-duration="800"
            data-aos-once="false"
          >
            <Star className="w-5 h-5 text-primary fill-current" />
            <span className="gradient-text font-bold">Trusted by 10,000+ customers</span>
          </div>

          {/* Modern Main Heading */}
          <h1
            className={`heading-xl text-gray-900 mb-6 transform transition-all duration-1000 delay-200 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="false"
          >
            <span className="text-gray-900">Fresh </span>
            <span className="gradient-text relative">
              Groceries
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-gradient-to-r from-primary/20 to-primary/10 -z-10 transform skew-y-1 rounded-lg"></div>
            </span>
            <br />
            <span className="text-gray-900">Delivered </span>
            <span className="gradient-text">Daily</span>
          </h1>

          {/* Modern Subtitle */}
          <p
            className={`text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium transform transition-all duration-1000 delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
            data-aos-once="false"
          >
            Get farm-fresh groceries delivered to your doorstep within hours.
            <br />
            <span className="gradient-text font-semibold">Quality guaranteed, prices unbeatable.</span>
          </p>

          {/* Modern Stats */}
          <div
            className={`grid grid-cols-3 gap-8 mb-12 transform transition-all duration-1000 delay-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
            data-aos-once="false"
          >
            <div className="text-center group">
              <div className="heading-lg gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter end={10000} suffix="+" duration={2000} />
              </div>
              <p className="text-gray-600 font-semibold">Happy Customers</p>
            </div>
            <div className="text-center group">
              <div className="heading-lg gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter end={500} suffix="+" duration={2000} />
              </div>
              <p className="text-gray-600 font-semibold">Daily Orders</p>
            </div>
            <div className="text-center group">
              <div className="heading-lg gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter end={15} suffix="+" duration={2000} />
              </div>
              <p className="text-gray-600 font-semibold">Years Experience</p>
            </div>
          </div>

          {/* Modern CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 transform transition-all duration-1000 delay-500 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="600"
            data-aos-once="false"
          >
            <Link href="/shop" className="btn-primary flex items-center gap-3 text-lg px-10 py-4 group shadow-xl">
              Shop Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <button className="group flex items-center gap-4 text-gray-700 hover:text-primary font-semibold text-lg transition-colors duration-300">
              <div className="w-14 h-14 glass-card hover:bg-primary/10 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-primary/20">
                <Play className="w-6 h-6 ml-1 group-hover:scale-110 transition-transform duration-300" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Modern Customer Avatars */}
          <div
            className={`flex items-center justify-center gap-6 transform transition-all duration-1000 delay-600 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-80"
            }`}
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="800"
            data-aos-once="false"
          >
            <div className="flex -space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/60 rounded-full border-3 border-white shadow-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary/50 to-primary/80 rounded-full border-3 border-white shadow-lg"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary/70 to-primary rounded-full border-3 border-white shadow-lg"></div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full border-3 border-white shadow-lg"></div>
            </div>
            <span className="text-gray-600 font-semibold">
              Join <span className="gradient-text font-bold">10k+</span> happy customers
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
