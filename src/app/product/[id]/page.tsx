"use client";

import ProductDetail from "@/components/ProductDetail";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  return <ProductDetail productId={resolvedParams.id} />;
}
