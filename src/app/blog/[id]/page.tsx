"use client";

import { useParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Folder,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  Eye,
  Tag,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore } from "@/lib/store";

export default function BlogDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
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

  const post = allArticles.find((post) => post.id === postId);

  if (!post && allArticles.length > 0) {
    notFound();
  }

  // Show loading while articles are being loaded
  if (allArticles.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get related posts from the same category
  const getRelatedPosts = (postId: number, category: string) => {
    return allArticles
      .filter((p) => p.id !== postId && p.category === category)
      .slice(0, 3);
  };

  const relatedPosts = getRelatedPosts(postId, post.category);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8 lg:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-900 capitalize">{post.category}</span>
            </nav>

            {/* Article Header */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Folder size={14} />
                <span className="capitalize">{post.category}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Featured Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12">
                  {/* Article Body */}
                  <div className="prose prose-lg max-w-none">
                    <div className="text-lg leading-relaxed text-gray-700 mb-8">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: post.content.replace(/\n/g, "<br/>"),
                        }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="border-t border-gray-200 pt-8 mb-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Tag size={16} />
                          Tags:
                        </span>
                        {post.tags.map((tag: string, index: number) => (
                          <Link
                            key={index}
                            href={`/blog?tag=${tag}`}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full 
                                     hover:bg-primary hover:text-white transition-all duration-300"
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Share this article
                        </h3>
                        <p className="text-sm text-gray-600">
                          Help others discover this content
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                          <Facebook size={20} />
                        </button>
                        <button className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors">
                          <Twitter size={20} />
                        </button>
                        <button className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                          <Linkedin size={20} />
                        </button>
                        <button className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Posts */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  Recent Articles
                </h3>
                <div className="space-y-4">
                  {allArticles.slice(0, 5).map((recentPost) => (
                    <Link
                      key={recentPost.id}
                      href={`/blog/${recentPost.id}`}
                      className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-lg">
                        <Image
                          src={recentPost.image || "/placeholder.svg"}
                          alt={recentPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {recentPost.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar size={12} />
                          <span>{recentPost.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  Categories
                </h3>
                <div className="space-y-2">
                  {[...new Set(allArticles.map((post) => post.category))].map(
                    (category, index) => (
                      <Link
                        key={index}
                        href={`/blog?category=${category}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg
                               hover:bg-gray-50 hover:text-primary transition-colors group"
                      >
                        <span className="capitalize font-medium">
                          {category}
                        </span>
                        <span
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full
                                       group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                          {
                            allArticles.filter(
                              (post) => post.category === category
                            ).length
                          }
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(allArticles.flatMap((post) => post.tags))]
                    .slice(0, 10)
                    .map((tag, index) => (
                      <Link
                        key={index}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 text-sm rounded-full 
                               hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        #{tag}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white shadow-sm rounded-2xl overflow-hidden
                             hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="overflow-hidden">
                      <Link href={`/blog/${relatedPost.id}`}>
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                          <Folder size={12} />
                          <span className="capitalize">
                            {relatedPost.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {relatedPost.date}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                        <Link
                          href={`/blog/${relatedPost.id}`}
                          className="text-gray-900 hover:text-primary transition-colors duration-300"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
