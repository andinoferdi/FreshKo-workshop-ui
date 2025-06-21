import { ShoppingCart, Shield, Award, MapPin, Gift } from "lucide-react"

const features = [
  {
    icon: ShoppingCart,
    title: "Free Delivery",
    description: "Enjoy free, fast delivery on all orders over $50.",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your payments are 100% secure with our encrypted system.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "We source only the freshest, highest-quality products for you.",
  },
  {
    icon: MapPin,
    title: "Wide Coverage",
    description: "We deliver to a vast area, ensuring you get your groceries.",
  },
  {
    icon: Gift,
    title: "Daily Offers",
    description: "Check back daily for new offers and discounts on your favorite items.",
  },
]

export default function Features() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-white to-green-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-primary rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="heading-lg text-gray-900 mb-4">
            Why Choose <span className="gradient-text">FreshKo</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            We are committed to providing you with the best products and services. Here's what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-8 modern-card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
            >
              <div className="inline-block p-6 bg-gradient-to-br from-green-100 to-green-200 text-primary rounded-2xl mb-6 group-hover:bg-gradient-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 transform shadow-lg">
                <feature.icon size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
