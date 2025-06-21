import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Shield,
  Clock,
  Users,
  Utensils,
  Leaf,
  Phone,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const services = [
    {
      icon: Truck,
      title: "Fresh Delivery Service",
      description:
        "Get farm-fresh groceries delivered to your doorstep within 2-4 hours. Our temperature-controlled vehicles ensure your produce arrives as fresh as the day it was picked.",
      features: [
        "Same-day delivery available",
        "Temperature-controlled transport",
        "Real-time tracking",
        "Contactless delivery options",
      ],
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description:
        "We stand behind every product we deliver. If you're not completely satisfied with the freshness or quality of any item, we'll replace it or provide a full refund.",
      features: [
        "100% freshness guarantee",
        "Easy return process",
        "Quality inspection at source",
        "Money-back promise",
      ],
    },
    {
      icon: Clock,
      title: "Subscription Services",
      description:
        "Never run out of essentials again. Set up recurring deliveries for your favorite products and enjoy exclusive subscriber discounts and priority delivery slots.",
      features: [
        "Flexible scheduling",
        "Subscriber-only discounts",
        "Priority delivery slots",
        "Easy modification anytime",
      ],
    },
    {
      icon: Users,
      title: "Personal Shopping",
      description:
        "Our trained personal shoppers carefully select each item based on your preferences. They know how to pick the ripest fruits and freshest vegetables just for you.",
      features: [
        "Expert product selection",
        "Customized preferences",
        "Special dietary considerations",
        "Detailed item notes",
      ],
    },
    {
      icon: Utensils,
      title: "Corporate Catering",
      description:
        "Fuel your team with fresh, healthy options. We provide bulk ordering for offices, events, and corporate functions with special business pricing.",
      features: [
        "Bulk order discounts",
        "Flexible delivery scheduling",
        "Invoice billing available",
        "Dedicated account manager",
      ],
    },
    {
      icon: Leaf,
      title: "Organic & Sustainable",
      description:
        "Choose from our extensive selection of certified organic products and sustainably sourced items. We partner with local farms committed to environmental responsibility.",
      features: [
        "Certified organic options",
        "Local farm partnerships",
        "Eco-friendly packaging",
        "Carbon-neutral delivery",
      ],
    },
  ];

  const additionalServices = [
    {
      title: "Recipe Meal Kits",
      description:
        "Pre-portioned ingredients with chef-designed recipes delivered weekly.",
      image: "/images/ad-image-1.png",
    },
    {
      title: "Seasonal Produce Boxes",
      description:
        "Curated selection of the season's best fruits and vegetables.",
      image: "/images/ad-image-2.png",
    },
    {
      title: "Specialty Diet Support",
      description:
        "Dedicated sections for keto, vegan, gluten-free, and other dietary needs.",
      image: "/images/ad-image-3.png",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Services</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-primary">Services</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                From farm to table, we provide comprehensive grocery solutions
                designed to make fresh, healthy eating convenient and accessible
                for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors transform hover:scale-105"
                >
                  Start Shopping
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all transform hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover our comprehensive range of services designed to bring
                you the freshest groceries with unmatched convenience and
                quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-green-50 p-3 rounded-lg mr-4">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Specialized Offerings
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our specialized services tailored to meet your unique
                dietary needs and lifestyle preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Getting fresh groceries delivered has never been easier. Follow
                these simple steps to start enjoying farm-fresh produce.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Browse & Select",
                  description:
                    "Browse our extensive catalog of fresh produce, dairy, meats, and pantry essentials. Add items to your cart with just a click.",
                },
                {
                  step: "02",
                  title: "Choose Delivery",
                  description:
                    "Select your preferred delivery time slot. We offer same-day delivery and flexible scheduling to fit your lifestyle.",
                },
                {
                  step: "03",
                  title: "Personal Shopping",
                  description:
                    "Our expert shoppers carefully select each item, ensuring you receive the freshest and highest quality products available.",
                },
                {
                  step: "04",
                  title: "Fresh Delivery",
                  description:
                    "Receive your groceries at your doorstep in temperature-controlled packaging, maintaining optimal freshness from store to door.",
                },
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 lg:py-20 bg-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <Phone className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Need Help Choosing the Right Service?
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Our customer service team is here to help you find the perfect
                service package for your needs. Get personalized recommendations
                and answers to all your questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Contact Support
                </Link>
                <a
                  href="tel:+1-800-FRESHKO"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all transform hover:scale-105"
                >
                  Call +1-800-FRESHKO
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
