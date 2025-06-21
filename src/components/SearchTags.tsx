import Link from "next/link";

const searchTags = [
  "Apple",
  "Blue diamond almonds",
  "Banana",
  "Avocado",
  "Broccoli",
  "Berries",
  "Cucumber",
  "Tomato",
  "Orange",
  "Grapes",
  "Blue diamond almonds",
  "Carrots",
  "Spinach",
  "Milk",
  "Bread",
  "Eggs",
];

export default function SearchTags() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">People are also looking for</h2>
        <div className="flex flex-wrap gap-3">
          {searchTags.map((tag, index) => (
            <button
              key={index}
              className="bg-green-50 hover:bg-green-100 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm transition-colors border border-green-200 hover:border-green-300"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
