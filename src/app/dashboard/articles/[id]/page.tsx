"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  Eye,
  Clock,
  Tag,
  Share2,
  FileText,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHydratedStore } from "@/lib/store";
import type { BlogPost } from "@/lib/blog";
import { toast } from "sonner";

export default function DashboardArticleDetailPage() {
  const { id } = useParams();
  const articleId = Number(id);
  const { getArticleById, deleteArticle } = useHydratedStore();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadArticle = () => {
      const foundArticle = getArticleById(articleId);
      setArticle(foundArticle || null);
      setIsLoading(false);
    };

    loadArticle();

    // Listen for article updates
    const handleArticleUpdate = () => {
      setTimeout(loadArticle, 100);
    };

    window.addEventListener("articleUpdated", handleArticleUpdate);
    window.addEventListener("articleDeleted", handleArticleUpdate);

    return () => {
      window.removeEventListener("articleUpdated", handleArticleUpdate);
      window.removeEventListener("articleDeleted", handleArticleUpdate);
    };
  }, [articleId, getArticleById]);

  const handleDeleteArticle = async () => {
    if (!article) return;

    if (article.isEditable === false) {
      toast.error("Cannot delete original articles");
      return;
    }

    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      setIsDeleting(true);
      try {
        const result = await deleteArticle(article.id);
        if (result.success) {
          toast.success("Article deleted successfully");
          window.location.href = "/dashboard/articles";
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete article");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading article details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return notFound();
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/dashboard/articles"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Articles
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Article ID: {article.id}</span>
                <span>•</span>
                <span>Published: {article.date}</span>
                <span>•</span>
                <span>Author: {article.author}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {article.isEditable !== false && (
                <>
                  <Link
                    href={`/dashboard/articles/edit/${article.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    <Edit size={16} />
                    Edit Article
                  </Link>

                  <button
                    onClick={handleDeleteArticle}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete Article
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Image & Stats */}
          <div className="lg:col-span-1">
            <div className="modern-card p-6">
              <div className="relative w-full h-60 mb-4">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Article Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-500" size={16} />
                    <span className="text-sm font-medium">Published</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {article.date}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="text-green-500" size={16} />
                    <span className="text-sm font-medium">Author</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {article.author}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="text-purple-500" size={16} />
                    <span className="text-sm font-medium">Category</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {article.category || "General"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="text-orange-500" size={16} />
                    <span className="text-sm font-medium">Read Time</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {article.readTime || "5 min"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Article Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-900">
                      {article.title}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {article.category || "General"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-900">
                      {article.author}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Date
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{article.date}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {article.readTime || "5 min"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-green-600">
                      Published
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Summary */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {article.excerpt || "No summary available for this article."}
                </p>
              </div>
            </div>

            {/* Content Preview */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Content Preview
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {article.content
                    ? article.content.substring(0, 500) +
                      (article.content.length > 500 ? "..." : "")
                    : "No content available for this article."}
                </p>
              </div>
            </div>

            {/* Management Information */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Management Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Article ID</p>
                    <p className="font-semibold text-gray-900">{article.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Created By</p>
                    <p className="font-semibold text-gray-900">
                      {article.createdBy || "System"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Tag className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Editable</p>
                    <p className="font-semibold text-gray-900">
                      {article.isEditable !== false ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-green-600">Published</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {article.isEditable !== false && (
              <div className="modern-card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/articles/edit/${article.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    <Edit size={16} />
                    Edit Article
                  </Link>

                  <Link
                    href={`/blog/${article.id}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    <Eye size={16} />
                    View on Website
                  </Link>

                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium">
                    <Share2 size={16} />
                    Share Article
                  </button>

                  <button
                    onClick={handleDeleteArticle}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete Article
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
