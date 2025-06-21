"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getCategoriesWithCount } from "@/lib/products";

// Category images mapping
const categoryImages: { [key: string]: string } = {
  fruits: "/images/thumb-avocado.png",
  vegetables: "/images/thumb-tomatoes.png",
  dairy: "/images/thumb-milk.png",
  seafood: "/images/thumb-tuna.jpg",
  beverages: "/images/thumb-orange-juice.png",
  bakery: "/images/thumb-biscuits.png",
  pantry: "/images/thumb-honey.jpg",
  condiments: "/images/thumb-tomatoketchup.png",
};

export default function CategorySection() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<
    { name: string; count: string; image: string; id: number }[]
  >([]);

  useEffect(() => {
    // Get real categories with counts
    const categoriesWithCount = getCategoriesWithCount();
    const categoriesData = categoriesWithCount.map((category, index) => ({
      id: index + 1,
      name: category.name.charAt(0).toUpperCase() + category.name.slice(1),
      image: categoryImages[category.name] || "/placeholder.svg",
      count: `${category.count} item${category.count !== 1 ? "s" : ""}`,
    }));
    setCategories(categoriesData);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("categories");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="categories"
      className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Shop by Category
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Browse Our Fresh
            <span className="text-primary relative ml-2">
              Categories
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-primary/30"
                viewBox="0 0 100 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6C20 2 40 1 60 2C80 3 90 4 98 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of fresh, quality products organized by
            category for your convenience
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group relative transform transition-all duration-500 hover:scale-105 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={`/shop?category=${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <div className="relative bg-white group-hover:bg-primary rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl border border-gray-100 group-hover:border-primary overflow-hidden">
                  {/* Category Image */}
                  <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 bg-white">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-primary/30 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
                  </div>

                  {/* Category Info */}
                  <div className="relative z-10">
                    <h3 className="font-semibold text-gray-900 group-hover:text-white mb-1 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-white/90 mb-3 transition-colors duration-300">
                      {category.count}
                    </p>

                    {/* Hover Arrow */}
                    <div
                      className={`inline-flex items-center gap-1 text-primary group-hover:text-white font-medium text-sm transform transition-all duration-300 ${
                        hoveredCategory === category.id
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0"
                      }`}
                    >
                      Shop Now
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-300"></div>

                  {/* Sparkle Effect */}
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className="text-center mt-12"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for?
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold 
                     hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
