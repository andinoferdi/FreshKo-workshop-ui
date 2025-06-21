import Image from "next/image"
import Link from "next/link"
import { Calendar, Folder, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="modern-card overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
      <div className="overflow-hidden">
        <Link href={`/blog/${post.id}`}>
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-6 text-sm text-gray-500 uppercase mb-4 font-semibold">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {post.date}
          </div>
          <div className="flex items-center gap-2">
            <Folder size={16} />
            {post.category}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-gray-900 leading-tight">
          <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors duration-300">
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 leading-relaxed mb-6 font-medium">{post.excerpt}</p>

        <Link
          href={`/blog/${post.id}`}
          className="font-bold text-primary hover:text-primary/80 transition-colors duration-300 flex items-center gap-2 group-hover:translate-x-1 transform"
        >
          Read More <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  )
}
