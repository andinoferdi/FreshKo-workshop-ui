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
    <section className="py-8 lg:py-12 bg-blue-50">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout: 2/3 for slider, 1/3 for promo blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
          {/* Main Slider - Takes 2/3 on large screens */}
          <div className="lg:col-span-2 bg-white rounded-xl relative overflow-hidden">
            <div className="relative h-full">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex items-center h-full p-8 lg:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                      <div className="space-y-4">
                        <div className="text-xl lg:text-2xl font-serif text-primary">{slide.category}</div>
                        <h1 className="text-2xl lg:text-4xl font-bold leading-tight text-gray-900">{slide.title}</h1>
                        <p className="text-base text-gray-600">{slide.description}</p>
                        <Link
                          href="/shop"
                          className="inline-block bg-primary text-white px-6 py-2 text-sm font-semibold uppercase rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                      <div className="flex justify-center">
                        <Image
                          src={slide.image || "/placeholder.svg"}
                          alt={slide.title}
                          width={250}
                          height={250}
                          className="max-w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                    index === currentSlide
                      ? "bg-primary border-primary scale-125"
                      : "bg-white border-gray-300 hover:scale-110"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Promotional Blocks - Takes 1/3 on large screens, stacked vertically */}
          <div className="flex flex-col gap-6">
            {/* Fruits & Vegetables Block */}
            <div className="bg-green-50 rounded-xl p-6 h-full relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">20% Off</div>
                  <div className="w-12 h-0.5 bg-gray-900"></div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">SALE</div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">Fruits &<br />Vegetables</h3>
                  <Link href="/shop?category=fruits" className="flex items-center text-gray-600 hover:text-primary text-sm">
                    Shop Collection
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
                             {/* Background Image - Optional */}
               <div className="absolute bottom-0 right-0 opacity-20">
                 <Image
                   src="/images/ad-image-1.png"
                   alt="Fruits"
                   width={120}
                   height={120}
                   className="object-contain"
                 />
               </div>
            </div>

            {/* Baked Products Block */}
            <div className="bg-orange-50 rounded-xl p-6 h-full relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">15% Off</div>
                  <div className="w-12 h-0.5 bg-gray-900"></div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">SALE</div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">Baked Products</h3>
                  <Link href="/shop?category=bakery" className="flex items-center text-gray-600 hover:text-primary text-sm">
                    Shop Collection
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
                             {/* Background Image - Optional */}
               <div className="absolute bottom-0 right-0 opacity-20">
                 <Image
                   src="/images/ad-image-2.png"
                   alt="Bakery"
                   width={120}
                   height={120}
                   className="object-contain"
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
