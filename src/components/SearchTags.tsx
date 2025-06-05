import Link from "next/link"

const searchTags = [
  "Blue diamon almonds",
  "Angie's Boomchickapop Corn",
  "Salty kettle Corn",
  "Chobani Greek Yogurt",
  "Sweet Vanilla Yogurt",
  "Foster Farms Takeout Crispy wings",
  "Warrior Blend Organic",
  "Chao Cheese Creamy",
  "Chicken meatballs",
  "Blue diamon almonds",
  "Angie's Boomchickapop Corn",
  "Salty kettle Corn",
  "Chobani Greek Yogurt",
  "Sweet Vanilla Yogurt",
  "Foster Farms Takeout Crispy wings",
  "Warrior Blend Organic",
  "Chao Cheese Creamy",
  "Chicken meatballs",
]

export default function SearchTags() {
  return (
    <section className="py-12">
      <div className="container-fluid">
        <h2 className="text-3xl font-bold mb-8">People are also looking for</h2>
        <div className="flex flex-wrap gap-2">
          {searchTags.map((tag, index) => (
            <Link
              key={index}
              href="#"
              className="bg-yellow-100 hover:bg-yellow-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
