import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import ProductTabs from "../components/ProductTabs";
import PromoBanners from "../components/PromoBanners";
import NewsletterSection from "../components/NewsletterSection";
import BlogSection from "../components/BlogSection";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <CategorySection />
      <ProductTabs />
      <PromoBanners />
      <NewsletterSection />
      <BlogSection />
      <Features />
      <Footer />
    </main>
  );
}
