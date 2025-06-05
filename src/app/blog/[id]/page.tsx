"use client"

import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Folder, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { blogPosts, getRelatedPosts } from "@/lib/blog"

export default function BlogDetailPage() {
  const { id } = useParams()
  const postId = Number(id)

  const post = blogPosts.find((post) => post.id === postId)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(postId, post.category)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-[300px] md:h-[400px]">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Folder size={16} />
                      {post.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      {post.author}
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

                  {/* Content */}
                  <div className="prose max-w-none text-gray-700 mb-8">
                    <p className="mb-4">{post.content}</p>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia,
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                    </p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Key Takeaways</h2>
                    <ul className="list-disc pl-5 mb-6">
                      <li className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                      <li className="mb-2">Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl.</li>
                      <li className="mb-2">Eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia.</li>
                      <li className="mb-2">Nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.</li>
                    </ul>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia,
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
                    </p>
                    <blockquote className="border-l-4 border-primary pl-4 italic my-6">
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
                      nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl."
                    </blockquote>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-sm font-medium">Tags:</span>
                    {post.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>

                  {/* Share */}
                  <div className="flex items-center gap-4 pt-6 border-t">
                    <span className="font-medium">Share:</span>
                    <div className="flex gap-2">
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors">
                        <Facebook size={18} />
                      </button>
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-400 transition-colors">
                        <Twitter size={18} />
                      </button>
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors">
                        <Linkedin size={18} />
                      </button>
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Recent Posts */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 5).map((recentPost) => (
                    <div key={recentPost.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-16 h-16 relative">
                        <Image
                          src={recentPost.image || "/placeholder.svg"}
                          alt={recentPost.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-primary">
                          <Link href={`/blog/${recentPost.id}`}>{recentPost.title}</Link>
                        </h4>
                        <span className="text-xs text-gray-500">{recentPost.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  {[...new Set(blogPosts.map((post) => post.category))].map((category, index) => (
                    <Link
                      key={index}
                      href={`/blog?category=${category}`}
                      className="flex items-center justify-between py-2 border-b border-gray-100 hover:text-primary"
                    >
                      <span className="capitalize">{category}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {blogPosts.filter((post) => post.category === category).length}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(blogPosts.flatMap((post) => post.tags))].map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white border-0 shadow-sm rounded-lg p-2 lg:p-3 hover:shadow-lg transition-shadow"
                  >
                    <div className="overflow-hidden rounded-lg mb-4">
                      <Link href={`/blog/${relatedPost.id}`}>
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          width={400}
                          height={250}
                          className="w-full h-auto hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>

                    <div className="p-2 lg:p-3">
                      <div className="flex items-center gap-3 lg:gap-4 text-sm text-gray-500 uppercase mb-2 lg:mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {relatedPost.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Folder size={14} />
                          {relatedPost.category}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-3">
                        <Link
                          href={`/blog/${relatedPost.id}`}
                          className="text-dark hover:text-primary transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 leading-relaxed">{relatedPost.excerpt}</p>
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
  )
}
