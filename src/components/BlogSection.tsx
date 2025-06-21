import Image from "next/image";
import Link from "next/link";
import { Calendar, Folder, ArrowRight } from "lucide-react";

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
];

export default function BlogSection() {
  return (
    <section className="bg-white py-12 lg:py-20">
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
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
            >
              <div className="overflow-hidden">
                <Link href={`/blog/${post.id}`}>
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 uppercase mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Folder size={14} />
                    {post.category}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 leading-snug">
                  <Link
                    href={`/blog/${post.id}`}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="font-semibold text-primary hover:text-green-700 transition-colors duration-300 flex items-center gap-2"
                >
                  Read More <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div
          className="text-center mt-5"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <Link
            href="/blog"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
