"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Award, Truck, Shield, Heart, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Truck, label: "Daily Deliveries", value: "500+" },
    { icon: Shield, label: "Quality Products", value: "100%" },
  ];

  const team = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      image: "/images/reviewer-1.jpg",
      description:
        "Passionate about bringing fresh, quality groceries to every household.",
    },
    {
      name: "Sarah Johnson",
      role: "Head of Operations",
      image: "/images/reviewer-2.jpg",
      description:
        "Ensures smooth operations and timely delivery of all orders.",
    },
    {
      name: "Mike Chen",
      role: "Quality Manager",
      image: "/images/reviewer-3.jpg",
      description:
        "Maintains the highest standards for all our products and suppliers.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description:
        "We carefully select every product to ensure the highest quality.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Same-day delivery to keep your groceries fresh and convenient.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your safety and satisfaction are our top priorities.",
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">About Us</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  About <span className="text-primary">FreshKo</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We're passionate about bringing you the freshest,
                  highest-quality groceries right to your doorstep. Since 2008,
                  we've been committed to supporting local farmers and providing
                  our community with nutritious, delicious food options.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/shop"
                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold 
                             hover:bg-primary/90 transition-all duration-300 
                             hover:scale-105 hover:shadow-lg shadow-primary/20"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold 
                             border border-gray-200 hover:bg-gray-50 hover:border-primary/20 
                             transition-all duration-300 hover:scale-105"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="relative" data-aos="fade-left">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl"></div>
                <Image
                  src="/images/banner-image-1.jpg"
                  alt="Fresh groceries"
                  width={600}
                  height={500}
                  className="relative rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative" data-aos="fade-right">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl"></div>
                <Image
                  src="/images/banner-image-2.jpg"
                  alt="Our mission"
                  width={500}
                  height={400}
                  className="relative rounded-2xl shadow-lg"
                />
              </div>
              <div data-aos="fade-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We believe that everyone deserves access to fresh, nutritious
                  food. Our mission is to make healthy eating convenient and
                  affordable by connecting our community with local farmers and
                  trusted suppliers.
                </p>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our dedicated team works tirelessly to bring you the best
                grocery shopping experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 text-center 
                                         hover:shadow-lg transition-all duration-300 
                                         hover:scale-105 group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose FreshKo?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're committed to providing the best grocery shopping
                experience with unmatched quality and service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                className="bg-white rounded-2xl p-8 text-center shadow-sm 
                                       hover:shadow-xl transition-all duration-300 
                                       hover:scale-105 group"
                data-aos="fade-up"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  Customer First
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your satisfaction is our priority. We go above and beyond to
                  ensure you have the best shopping experience.
                </p>
              </div>

              <div
                className="bg-white rounded-2xl p-8 text-center shadow-sm 
                                       hover:shadow-xl transition-all duration-300 
                                       hover:scale-105 group"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  Premium Quality
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We source only the finest products from trusted suppliers and
                  local farms to ensure premium quality.
                </p>
              </div>

              <div
                className="bg-white rounded-2xl p-8 text-center shadow-sm 
                                       hover:shadow-xl transition-all duration-300 
                                       hover:scale-105 group"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  Trusted & Secure
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Shop with confidence knowing that your personal information
                  and payments are completely secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust FreshKo for their
              grocery needs.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold 
                       hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
