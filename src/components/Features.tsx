import { ShoppingCart, Shield, Award, MapPin, Gift } from "lucide-react"

const features = [
  {
    icon: ShoppingCart,
    title: "Free delivery",
    description: "Lorem ipsum dolor sit amet, consectetur adipi elit.",
  },
  {
    icon: Shield,
    title: "100% secure payment",
    description: "Lorem ipsum dolor sit amet, consectetur adipi elit.",
  },
  {
    icon: Award,
    title: "Quality guarantee",
    description: "Lorem ipsum dolor sit amet, consectetur adipi elit.",
  },
  {
    icon: MapPin,
    title: "guaranteed savings",
    description: "Lorem ipsum dolor sit amet, consectetur adipi elit.",
  },
  {
    icon: Gift,
    title: "Daily offers",
    description: "Lorem ipsum dolor sit amet, consectetur adipi elit.",
  },
]

export default function Features() {
  return (
    <section className="section-spacing-sm">
      <div className="container-fluid">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3 lg:gap-4 items-start">
              <div className="flex-shrink-0 text-dark">
                <feature.icon size={32} />
              </div>
              <div>
                <h5 className="font-semibold text-lg mb-1 lg:mb-2">{feature.title}</h5>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
