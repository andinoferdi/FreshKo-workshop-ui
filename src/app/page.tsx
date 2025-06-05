import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import CategorySection from "../components/CategorySection"
import BrandSection from "../components/BrandSection"
import ProductTabs from "../components/ProductTabs"
import PromoBanners from "../components/PromoBanners"
import BestSellingProducts from "../components/BestSellingProducts"
import NewsletterSection from "../components/NewsletterSection"
import PopularProducts from "../components/PopularProducts"
import JustArrived from "../components/JustArrived"
import BlogSection from "../components/BlogSection"
import SearchTags from "../components/SearchTags"
import Features from "../components/Features"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <CategorySection />
      <BrandSection />
      <ProductTabs />
      <PromoBanners />
      <BestSellingProducts />
      <NewsletterSection />
      <PopularProducts />
      <JustArrived />
      <BlogSection />
      <SearchTags />
      <Features />
      <Footer />
    </main>
  )
}
