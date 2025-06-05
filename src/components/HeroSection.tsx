"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    category: "100% natural",
    title: "Fresh Smoothie & Summer Juice",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.",
    image: "/images/product-thumb-1.png",
    buttonText: "Shop Now",
  },
  {
    id: 2,
    category: "100% natural",
    title: "Fresh Smoothie & Summer Juice",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.",
    image: "/images/product-thumb-1.png",
    buttonText: "Shop Collection",
  },
  {
    id: 3,
    category: "100% natural",
    title: "Heinz Tomato Ketchup",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.",
    image: "/images/product-thumb-2.png",
    buttonText: "Shop Collection",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section
      className="py-2 lg:py-3"
      style={{
        backgroundImage: "url('/images/background-pattern.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="banner-blocks">
          {/* Main Slider */}
          <div className="banner-ad bg-blue-50 block-1 relative overflow-hidden">
            <div className="relative h-full min-h-[630px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex items-center h-full p-4 lg:p-8 xl:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center w-full">
                      <div className="space-y-3 lg:space-y-4">
                        <div className="text-3xl lg:text-4xl font-serif text-dark">{slide.category}</div>
                        <h3 className="text-3xl lg:text-5xl font-bold leading-tight">{slide.title}</h3>
                        <p className="text-lg">{slide.description}</p>
                        <Link
                          href="/shop"
                          className="inline-block bg-transparent border-2 border-dark text-dark px-6 py-3 text-sm font-semibold uppercase rounded hover:bg-dark hover:text-white transition-colors"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                      <div className="flex justify-center">
                        <Image
                          src={slide.image || "/placeholder.svg"}
                          alt={slide.title}
                          width={300}
                          height={300}
                          className="max-w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                    index === currentSlide
                      ? "bg-yellow-200 border-yellow-200 scale-125"
                      : "bg-white border-white hover:scale-110"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Side Banners */}
          <div
            className="banner-ad bg-green-100 block-2 p-4 lg:p-5 flex items-end"
            style={{ background: "url('/images/ad-image-1.png') no-repeat right bottom, #dcfce7" }}
          >
            <div className="space-y-3">
              <div className="text-lg font-bold text-green-600 relative">
                20% off
                <span className="absolute -bottom-1 left-0 w-16 h-0.5 bg-dark"></span>
              </div>
              <h3 className="text-2xl font-bold">Fruits & Vegetables</h3>
              <Link href="/shop?category=fruits" className="flex items-center text-dark hover:text-primary">
                Shop Collection
                <ChevronRight size={20} className="ml-1" />
              </Link>
            </div>
          </div>

          <div
            className="banner-ad bg-red-100 block-3 p-5 flex items-end"
            style={{ background: "url('/images/ad-image-2.png') no-repeat right bottom, #fecaca" }}
          >
            <div className="space-y-3">
              <div className="text-lg font-bold text-red-600 relative">
                15% off
                <span className="absolute -bottom-1 left-0 w-16 h-0.5 bg-dark"></span>
              </div>
              <h3 className="text-2xl font-bold">Baked Products</h3>
              <Link href="/shop?category=bakery" className="flex items-center text-dark hover:text-primary">
                Shop Collection
                <ChevronRight size={20} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
