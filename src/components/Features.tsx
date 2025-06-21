import { ShoppingCart, Shield, Award, MapPin, Gift } from "lucide-react";

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
    description:
      "We source only the freshest, highest-quality products for you.",
  },
  {
    icon: MapPin,
    title: "Wide Coverage",
    description: "We deliver to a vast area, ensuring you get your groceries.",
  },
  {
    icon: Gift,
    title: "Daily Offers",
    description:
      "Check back daily for new offers and discounts on your favorite items.",
  },
];

export default function Features() {
  return (
    <section className="py-12 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Why Choose FreshKo?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are committed to providing you with the best products and
            services. Here's what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
            >
              <div className="inline-block p-4 bg-green-100 text-primary rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <feature.icon size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
