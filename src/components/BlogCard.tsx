import Image from "next/image";
import Link from "next/link";
import { Calendar, Folder, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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
          className="font-semibold text-primary hover:text-primary/80 transition-colors duration-300 flex items-center gap-2"
        >
          Read More <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
