"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { useHydratedStore } from "@/lib/store";

export default function BlogSection() {
  const { getAllArticles, initializeOriginalData } = useHydratedStore();
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

  // Get first 3 posts for homepage
  const featuredPosts = allArticles.slice(0, 3);

  return (
    <section className="bg-gray-50 py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5 lg:mb-5" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            From Our Blog
          </h2>
          <p className="text-gray-600">
            Get the latest tips, tricks, and inspiration from our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <div
              key={post.id}
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        <div
          className="text-center mt-5"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <Link
            href="/blog"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
