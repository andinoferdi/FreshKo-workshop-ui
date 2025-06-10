  "use client";

  import { useState, useEffect } from "react";
  import Image from "next/image";
  import Link from "next/link";
  import { ChevronLeft, ChevronRight } from "lucide-react";

  // Slide data
  const slides = [
    {
      id: 1,
      category: "100% natural",
      title: "Fresh Smoothie & Summer Juice",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.",
      image: "/images/product-thumb-1.png",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      category: "100% natural",
      title: "Fresh Smoothie & Summer Juice",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.",
      image: "/images/product-thumb-1.png",
      buttonText: "Shop Collection",
    },
    {
      id: 3,
      category: "100% natural",
      title: "Heinz Tomato Ketchup",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim massa diam elementum.",
      image: "/images/product-thumb-2.png",
      buttonText: "Shop Collection",
    },
  ];

  export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-rotate slides every 5 seconds
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
      <section className="w-full py-6 sm:py-8 md:py-12 lg:py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Main Hero Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Hero Slider - 8 columns on large screens */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm overflow-hidden relative">
              {/* Slider Content */}
              <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 translate-x-0"
                        : index < currentSlide 
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                    style={{ 
                      zIndex: index === currentSlide ? 10 : 5 
                    }}
                    aria-hidden={index !== currentSlide}
                  >
                    <div className="h-full flex items-center">
                      <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 p-6 sm:p-8 md:p-10 lg:p-12">
                        {/* Text Content - 3 columns */}
                        <div className="md:col-span-3 flex flex-col h-full pt-8 sm:pt-12 pb-16 sm:pb-20">
                          {/* Category Badge - Fixed Position */}
                          <div className="mb-4 sm:mb-6">
                            <span className="text-sm sm:text-base font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                              {slide.category}
                            </span>
                          </div>

                          {/* Title Container - Flexible but Consistent */}
                          <div className="mb-6 sm:mb-8 min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] lg:min-h-[14rem] flex items-start">
                            <h1 className="font-bold text-gray-900 leading-[1.1] tracking-tight">
                              {slide.title === "Heinz Tomato Ketchup" ? (
                                <>
                                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2">
                                    Heinz Tomato
                                  </span>
                                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                    Ketchup
                                  </span>
                                </>
                              ) : slide.title === "Fresh Smoothie & Summer Juice" ? (
                                <>
                                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2">
                                    Fresh Smoothie &
                                  </span>
                                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                    Summer Juice
                                  </span>
                                </>
                              ) : slide.title.includes("&") ? (
                                <>
                                  {slide.title.split("&").map((part, idx) => (
                                    <span
                                      key={idx}
                                      className={`block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ${idx === 0 ? 'mb-2' : ''}`}
                                    >
                                      {part.trim()}
                                      {idx === 0 && " &"}
                                    </span>
                                  ))}
                                </>
                              ) : (
                                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                  {slide.title}
                                </span>
                              )}
                            </h1>
                          </div>

                          {/* Description - Flexible Height */}
                          <div className="mb-8 sm:mb-10 flex-1 min-h-[4rem] flex items-start">
                            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-md lg:max-w-lg">
                              {slide.description}
                            </p>
                          </div>

                          {/* CTA Button - Always at Bottom */}
                          <div className="mt-auto">
                            <Link
                              href="/shop"
                              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl uppercase tracking-wide relative z-5 min-w-[160px] sm:min-w-[180px]"
                            >
                              {slide.buttonText}
                            </Link>
                          </div>
                        </div>

                        {/* Product Image - 2 columns - Fixed Position */}
                        <div className="md:col-span-2 flex items-center justify-center p-4 md:p-6">
                          <div className="relative w-full h-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[380px] flex items-center justify-center">
                            <Image
                              src={
                                slide.image ||
                                "/placeholder.svg?height=350&width=350"
                              }
                              alt={slide.title}
                              width={350}
                              height={350}
                              className="w-full h-auto object-contain drop-shadow-lg max-h-[300px] sm:max-h-[350px] md:max-h-[400px]"
                              priority={index === 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div 
                className="absolute right-4 sm:right-6 bottom-1/2 transform translate-y-1/2 flex flex-col space-y-4"
                style={{ zIndex: 30 }}
              >
                {/* Arrow Navigation */}
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Pagination Dots */}
              <div 
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3"
                style={{ zIndex: 30 }}
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-emerald-600 scale-125 shadow-lg"
                        : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? "true" : "false"}
                  />
                ))}
              </div>
            </div>

            {/* Promotional Sidebar - 4 columns on large screens */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {/* Fruits & Vegetables Promo */}
              <div className="bg-gradient-to-br from-green-50 to-green-50 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300 h-[220px] sm:h-[240px] lg:h-[260px]">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Discount Badge */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-none">
                      20% Off
                    </div>
                    <div className="w-12 sm:w-16 h-1 bg-gray-900 rounded-full"></div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-widest">
                      SALE
                    </div>
                  </div>

                  {/* Category & Link */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                      Fruits &<br />
                      Vegetables
                    </h3>
                    <Link
                      href="/shop?category=fruits"
                      className="inline-flex items-center text-sm sm:text-base font-medium text-gray-600 hover:text-emerald-600 transition-colors group-hover:translate-x-1 duration-300"
                    >
                      Shop Collection
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Image
                    src="/images/ad-image-1.png"
                    alt=""
                    width={120}
                    height={120}
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
                  />
                </div>
              </div>

              {/* Baked Products Promo */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300 h-[220px] sm:h-[240px] lg:h-[260px]">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Discount Badge */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-none">
                      15% Off
                    </div>
                    <div className="w-12 sm:w-16 h-1 bg-gray-900 rounded-full"></div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-widest">
                      SALE
                    </div>
                  </div>

                  {/* Category & Link */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                      Baked Products
                    </h3>
                    <Link
                      href="/shop?category=bakery"
                      className="inline-flex items-center text-sm sm:text-base font-medium text-gray-600 hover:text-orange-600 transition-colors group-hover:translate-x-1 duration-300"
                    >
                      Shop Collection
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Image
                    src="/images/ad-image-2.png"
                    alt=""
                    width={120}
                    height={120}
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
