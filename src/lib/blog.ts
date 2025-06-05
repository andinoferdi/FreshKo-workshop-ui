export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  author: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Top 10 casual look ideas to dress up your kids",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-1.jpg",
    date: "22 Aug 2021",
    category: "tips & tricks",
    author: "Admin",
    tags: ["kids", "fashion", "tips", "casual"],
  },
  {
    id: 2,
    title: "Latest trends of wearing street wears supremely",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-2.jpg",
    date: "25 Aug 2021",
    category: "trending",
    author: "Admin",
    tags: ["streetwear", "fashion", "trends", "style"],
  },
  {
    id: 3,
    title: "10 Different Types of comfortable clothes ideas for women",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-3.jpg",
    date: "28 Aug 2021",
    category: "inspiration",
    author: "Admin",
    tags: ["women", "comfort", "clothing", "ideas"],
  },
  {
    id: 4,
    title: "Healthy Eating: 5 Superfoods You Should Include in Your Diet",
    excerpt:
      "Discover the power of superfoods and how they can transform your health. Learn about the top 5 superfoods that should be part of your daily nutrition...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-1.jpg",
    date: "15 Dec 2023",
    category: "health",
    author: "Nutritionist",
    tags: ["health", "nutrition", "superfoods", "diet"],
  },
  {
    id: 5,
    title: "Organic vs Conventional: Making the Right Choice for Your Family",
    excerpt:
      "Understanding the differences between organic and conventional produce can help you make informed decisions for your family's health and budget...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-2.jpg",
    date: "10 Dec 2023",
    category: "organic",
    author: "Food Expert",
    tags: ["organic", "conventional", "family", "health"],
  },
  {
    id: 6,
    title: "Seasonal Produce Guide: What to Buy When",
    excerpt:
      "Eating seasonally not only saves money but also ensures you get the freshest, most nutritious produce. Here's your complete seasonal guide...",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
    image: "/images/post-thumb-3.jpg",
    date: "5 Dec 2023",
    category: "seasonal",
    author: "Chef",
    tags: ["seasonal", "produce", "fresh", "guide"],
  },
]

export const getRelatedPosts = (currentPostId: number, category: string, limit = 3): BlogPost[] => {
  return blogPosts.filter((post) => post.id !== currentPostId && post.category === category).slice(0, limit)
}
