import type { Product } from "./store"

export const products: Product[] = [
  {
    id: 1,
    name: "Fresh Avocados",
    price: 4.99,
    image: "/images/thumb-avocado.png",
    discount: 15,
    rating: 4.5,
    category: "fruits",
    description: "Fresh, ripe avocados perfect for salads, toast, or guacamole. Rich in healthy fats and nutrients.",
    inStock: true,
    unit: "per lb",
  },
  {
    id: 2,
    name: "Organic Bananas",
    price: 2.99,
    image: "/images/thumb-bananas.png",
    rating: 4.8,
    category: "fruits",
    description: "Sweet, organic bananas packed with potassium and natural energy. Perfect for smoothies or snacking.",
    inStock: true,
    unit: "per bunch",
  },
  {
    id: 3,
    name: "Fresh Milk",
    price: 3.49,
    image: "/images/thumb-milk.png",
    rating: 4.6,
    category: "dairy",
    description: "Fresh, pasteurized whole milk from local farms. Rich in calcium and protein.",
    inStock: true,
    unit: "1 gallon",
  },
  {
    id: 4,
    name: "Orange Juice",
    price: 5.99,
    image: "/images/thumb-orange-juice.png",
    discount: 10,
    rating: 4.4,
    category: "beverages",
    description: "100% pure orange juice with no added sugars. Freshly squeezed and vitamin C rich.",
    inStock: true,
    unit: "64 fl oz",
  },
  {
    id: 5,
    name: "Fresh Tomatoes",
    price: 3.99,
    image: "/images/thumb-tomatoes.png",
    rating: 4.3,
    category: "vegetables",
    description: "Vine-ripened tomatoes perfect for salads, cooking, or sandwiches. Locally grown.",
    inStock: true,
    unit: "per lb",
  },
  {
    id: 6,
    name: "Cucumber",
    price: 1.99,
    image: "/images/thumb-cucumber.png",
    rating: 4.2,
    category: "vegetables",
    description: "Crisp, fresh cucumbers perfect for salads or healthy snacking. Hydrating and low calorie.",
    inStock: true,
    unit: "each",
  },
  {
    id: 7,
    name: "Fresh Raspberries",
    price: 6.99,
    image: "/images/thumb-raspberries.png",
    discount: 20,
    rating: 4.7,
    category: "fruits",
    description: "Sweet, juicy raspberries packed with antioxidants. Perfect for desserts or breakfast.",
    inStock: true,
    unit: "6 oz container",
  },
  {
    id: 8,
    name: "Tomato Ketchup",
    price: 2.49,
    image: "/images/thumb-tomatoketchup.png",
    rating: 4.1,
    category: "condiments",
    description: "Classic tomato ketchup made from ripe tomatoes. Perfect for burgers, fries, and more.",
    inStock: true,
    unit: "20 oz bottle",
  },
  {
    id: 9,
    name: "Artisan Biscuits",
    price: 4.49,
    image: "/images/thumb-biscuits.png",
    rating: 4.5,
    category: "bakery",
    description: "Handcrafted artisan biscuits with a buttery, flaky texture. Perfect with tea or coffee.",
    inStock: true,
    unit: "12 pack",
  },
  {
    id: 10,
    name: "Natural Honey",
    price: 8.99,
    image: "/images/thumb-honey.jpg",
    rating: 4.8,
    category: "pantry",
    description: "Pure, raw honey from local beekeepers. Natural sweetener with health benefits.",
    inStock: true,
    unit: "16 oz jar",
  },
  {
    id: 11,
    name: "Fresh Herbs",
    price: 2.99,
    image: "/images/thumb-herb.jpg",
    rating: 4.4,
    category: "vegetables",
    description: "Fresh mixed herbs including basil, parsley, and cilantro. Perfect for cooking.",
    inStock: true,
    unit: "bunch",
  },
  {
    id: 12,
    name: "Premium Tuna",
    price: 12.99,
    image: "/images/thumb-tuna.jpg",
    discount: 25,
    rating: 4.6,
    category: "seafood",
    description: "Premium quality tuna steaks, fresh and sustainably sourced. Rich in protein and omega-3.",
    inStock: true,
    unit: "per lb",
  },
]

export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return []

  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category?.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery),
  )
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category)
}

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.discount && product.discount > 0)
}

export const getBestSellingProducts = (): Product[] => {
  return products.filter((product) => product.rating >= 4.5).slice(0, 8)
}

export const getPopularProducts = (): Product[] => {
  return products.slice(0, 8)
}

export const getCategories = (): string[] => {
  const categories = products.map((product) => product.category).filter(Boolean) as string[]
  return [...new Set(categories)]
}
