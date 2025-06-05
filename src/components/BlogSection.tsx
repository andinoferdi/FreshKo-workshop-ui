import Image from "next/image"
import Link from "next/link"
import { Calendar, Folder, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Top 10 casual look ideas to dress up your kids",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...",
    image: "/images/post-thumb-1.jpg",
    date: "22 Aug 2021",
    category: "tips & tricks",
  },
  {
    id: 2,
    title: "Latest trends of wearing street wears supremely",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...",
    image: "/images/post-thumb-2.jpg",
    date: "25 Aug 2021",
    category: "trending",
  },
  {
    id: 3,
    title: "10 Different Types of comfortable clothes ideas for women",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipi elit. Aliquet eleifend viverra enim tincidunt donec quam. A in arcu, hendrerit neque dolor morbi...",
    image: "/images/post-thumb-3.jpg",
    date: "28 Aug 2021",
    category: "inspiration",
  },
]

export default function BlogSection() {
  return (
    <section className="section-spacing">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 lg:mb-10">
          <h2 className="text-3xl font-bold">Our Recent Blog</h2>
          <Link href="/blog" className="flex items-center gap-2 text-gray-500 hover:text-primary">
            Read All Articles <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border-0 shadow-sm rounded-lg p-2 lg:p-3 hover:shadow-lg transition-shadow"
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <Link href={`/blog/${post.id}`}>
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
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
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Folder size={14} />
                    {post.category}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  <Link href={`/blog/${post.id}`} className="text-dark hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
