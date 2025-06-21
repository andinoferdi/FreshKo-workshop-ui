"use client";

import { useParams, notFound } from "next/navigation";
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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts, getRelatedPosts } from "@/lib/blog";

export default function BlogDetailPage() {
  const { id } = useParams();
  const postId = Number(id);

  const post = blogPosts.find((post) => post.id === postId);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(postId, post.category);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {post.excerpt ||
                "Read our latest blog post about fresh produce and healthy living."}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
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
              <span className="text-gray-900">{post.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                {/* Featured Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                      <Calendar size={16} />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                      <Folder size={16} />
                      <span className="capitalize">{post.category}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                      <User size={16} />
                      {post.author}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose max-w-none text-gray-700 mb-8">
                    <p className="mb-4 text-lg leading-relaxed">
                      {post.content}
                    </p>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
                      nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel
                      ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                      nisl eu nisl.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                      Key Takeaways
                    </h2>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                      <li className="mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </li>
                      <li className="mb-2">
                        Sed euismod, nisl vel ultricies lacinia, nisl nisl
                        aliquam nisl.
                      </li>
                      <li className="mb-2">
                        Eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel
                        ultricies lacinia.
                      </li>
                      <li className="mb-2">
                        Nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                      </li>
                    </ul>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
                      nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel
                      ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                      nisl eu nisl.
                    </p>
                    <blockquote className="border-l-4 border-primary pl-6 italic my-6 bg-gray-50 py-4 rounded-r-lg">
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
                      nisl, eu aliquam nisl nisl eu nisl."
                    </blockquote>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-sm font-medium text-gray-700">
                      Tags:
                    </span>
                    {post.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full 
                                 hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>

                  {/* Share */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Share:</span>
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white 
                                       transition-all duration-300 hover:scale-110"
                      >
                        <Facebook size={18} />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white 
                                       transition-all duration-300 hover:scale-110"
                      >
                        <Twitter size={18} />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white 
                                       transition-all duration-300 hover:scale-110"
                      >
                        <Linkedin size={18} />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-primary hover:text-white 
                                       transition-all duration-300 hover:scale-110"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recent Posts */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 5).map((recentPost) => (
                    <div key={recentPost.id} className="flex gap-3 group">
                      <div className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-lg">
                        <Image
                          src={recentPost.image || "/placeholder.svg"}
                          alt={recentPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                          <Link href={`/blog/${recentPost.id}`}>
                            {recentPost.title}
                          </Link>
                        </h4>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {recentPost.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Categories
                </h3>
                <div className="space-y-2">
                  {[...new Set(blogPosts.map((post) => post.category))].map(
                    (category, index) => (
                      <Link
                        key={index}
                        href={`/blog?category=${category}`}
                        className="flex items-center justify-between py-2 border-b border-gray-100 
                               hover:text-primary transition-colors group"
                      >
                        <span className="capitalize">{category}</span>
                        <span
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full
                                     group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                          {
                            blogPosts.filter(
                              (post) => post.category === category
                            ).length
                          }
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(blogPosts.flatMap((post) => post.tags))].map(
                    (tag, index) => (
                      <Link
                        key={index}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 text-sm rounded-full 
                               hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        {tag}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden
                             hover:shadow-lg hover:scale-105 transition-all duration-300 group"
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
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {relatedPost.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Folder size={14} />
                          <span className="capitalize">
                            {relatedPost.category}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                        <Link
                          href={`/blog/${relatedPost.id}`}
                          className="text-gray-900 hover:text-primary transition-colors duration-300"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 leading-relaxed line-clamp-3">
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
