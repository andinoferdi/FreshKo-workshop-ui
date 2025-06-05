"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCategories } from "@/lib/products"

// Mapping kategori ke icon dan nama display
const categoryConfig = {
  fruits: { 
    name: "Fruits", 
    image: "/images/icon-vegetables-broccoli.png" 
  },
  vegetables: { 
    name: "Vegetables", 
    image: "/images/icon-vegetables-broccoli.png" 
  },
  dairy: { 
    name: "Dairy Products", 
    image: "/images/icon-soft-drinks-bottle.png" 
  },
  beverages: { 
    name: "Beverages", 
    image: "/images/icon-soft-drinks-bottle.png" 
  },
  condiments: { 
    name: "Condiments", 
    image: "/images/icon-bread-baguette.png" 
  },
  bakery: { 
    name: "Bakery", 
    image: "/images/icon-bread-baguette.png" 
  },
  pantry: { 
    name: "Pantry", 
    image: "/images/icon-bread-herb-flour.png" 
  },
  seafood: { 
    name: "Seafood", 
    image: "/images/icon-animal-products-drumsticks.png" 
  },
}

export default function CategorySection() {
  const categories = getCategories()

  return (
    <section className="section-spacing overflow-hidden bg-white">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 lg:mb-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Category</h2>
        </div>

        <div className="flex gap-6 lg:gap-8 justify-center flex-wrap pb-6">
          {categories.map((category) => {
            const config = categoryConfig[category as keyof typeof categoryConfig] || {
              name: category.charAt(0).toUpperCase() + category.slice(1),
              image: "/images/icon-vegetables-broccoli.png"
            }
            
            return (
              <Link 
                key={category} 
                href={`/shop?category=${category}`}
                className="flex-shrink-0 group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <div className="text-center min-w-[100px] lg:min-w-[120px]">
                  <div className="w-16 h-16 lg:w-18 lg:h-18 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 group-hover:border-primary/20">
                    <Image
                      src={config.image}
                      alt={config.name}
                      width={40}
                      height={40}
                      className="w-8 h-8 lg:w-10 lg:h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm lg:text-base font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {config.name}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
