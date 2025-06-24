"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { useHydratedStore } from "@/lib/store";

function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getAllArticles, initializeOriginalData } = useHydratedStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [allArticles, setAllArticles] = useState<any[]>([]);

  // Initialize data and load articles
  useEffect(() => {
    const loadArticles = () => {
      initializeOriginalData();
      const articles = getAllArticles();
      setAllArticles(articles);
    };

    loadArticles();

    // Listen for article updates
    const handleArticleUpdate = () => {
      setTimeout(loadArticles, 100);
    };

    window.addEventListener("articleCreated", handleArticleUpdate);
    window.addEventListener("articleUpdated", handleArticleUpdate);
    window.addEventListener("articleDeleted", handleArticleUpdate);

    return () => {
      window.removeEventListener("articleCreated", handleArticleUpdate);
      window.removeEventListener("articleUpdated", handleArticleUpdate);
      window.removeEventListener("articleDeleted", handleArticleUpdate);
    };
  }, [getAllArticles, initializeOriginalData]);

  // Initialize state from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      setCategory(categoryParam);
    }
    if (tagParam) {
      setSearchQuery(tagParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (
    newCategory: string,
    newSearch: string,
    newSort: string
  ) => {
    const params = new URLSearchParams();

    if (newCategory !== "all") {
      params.set("category", newCategory);
    }
    if (newSearch) {
      params.set("search", newSearch);
    }
    if (newSort !== "latest") {
      params.set("sort", newSort);
    }

    const newURL = params.toString() ? `/blog?${params.toString()}` : "/blog";
    router.push(newURL, { scroll: false });
  };

  // Filter and sort blog posts
  const filteredPosts = allArticles
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === "all" || post.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // Get unique categories
  const categories = [
    "all",
    ...new Set(allArticles.map((post) => post.category)),
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fresh Ideas & Tips
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover recipes, nutrition tips, seasonal guides, and everything
              you need to make the most of fresh, healthy ingredients.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900">Blog</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const newSearch = e.target.value;
                    setSearchQuery(newSearch);
                    updateURL(category, newSearch, sortBy);
                  }}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           transition-all duration-300"
                />
              </div>

              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setCategory(newCategory);
                    updateURL(newCategory, searchQuery, sortBy);
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           appearance-none transition-all duration-300"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const newSort = e.target.value;
                    setSortBy(newSort);
                    updateURL(category, searchQuery, newSort);
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           appearance-none transition-all duration-300"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategory("all");
                  setSortBy("latest");
                  router.push("/blog");
                }}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold
                         hover:bg-primary/90 transition-colors duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={null}>
      <BlogContent />
    </Suspense>
  );
}
