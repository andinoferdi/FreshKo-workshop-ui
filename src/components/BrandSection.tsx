"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const brands = [
  {
    id: 1,
    image: "/images/product-thumb-11.jpg",
    brand: "Amber Jar",
    title: "Honey best nectar you wish to get",
  },
  {
    id: 2,
    image: "/images/product-thumb-12.jpg",
    brand: "Amber Jar",
    title: "Honey best nectar you wish to get",
  },
  {
    id: 3,
    image: "/images/product-thumb-13.jpg",
    brand: "Amber Jar",
    title: "Honey best nectar you wish to get",
  },
  {
    id: 4,
    image: "/images/product-thumb-14.jpg",
    brand: "Amber Jar",
    title: "Honey best nectar you wish to get",
  },
]

export default function BrandSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="section-spacing overflow-hidden">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center mb-8 lg:mb-10">
          <h2 className="text-3xl font-bold">Newly Arrived Brands</h2>
          <div className="flex items-center gap-4">
            <a href="/shop" className="text-gray-500 hover:text-primary">
              View All Categories →
            </a>
            <div className="flex gap-2">
              <button onClick={() => scroll("left")} className="swiper-prev">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scroll("right")} className="swiper-next">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4">
          {brands.map((brand) => (
            <div key={brand.id} className="flex-shrink-0 w-72 lg:w-80">
              <div className="bg-white p-2 lg:p-3 rounded-2xl shadow-sm border-0">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <Image
                      src={brand.image || "/placeholder.svg"}
                      alt={brand.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm mb-1">{brand.brand}</p>
                    <h5 className="font-semibold text-lg leading-tight">{brand.title}</h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
