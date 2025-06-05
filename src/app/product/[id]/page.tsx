import { notFound } from "next/navigation"
import { getProductById, products } from "@/lib/products"
import ProductDetail from "@/components/ProductDetail"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
