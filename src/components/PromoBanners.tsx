import Link from "next/link"

export default function PromoBanners() {
  return (
    <section className="section-spacing">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div
            className="banner-ad bg-red-100 rounded-xl p-6 lg:p-8 min-h-[250px] lg:min-h-[300px] flex items-center"
            style={{ background: "url('/images/ad-image-3.png') no-repeat right bottom, #fecaca" }}
          >
            <div className="space-y-3 lg:space-y-4">
              <div className="text-primary text-3xl font-bold">Upto 25% Off</div>
              <h3 className="text-3xl font-bold">Luxa Dark Chocolate</h3>
              <p className="text-lg">Very tasty & creamy vanilla flavour creamy muffins.</p>
              <Link
                href="/shop?category=bakery"
                className="inline-block bg-dark text-white px-6 py-3 text-sm font-semibold uppercase rounded hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          <div
            className="banner-ad bg-blue-100 rounded-xl p-6 lg:p-8 min-h-[250px] lg:min-h-[300px] flex items-center"
            style={{ background: "url('/images/ad-image-4.png') no-repeat right bottom, #dbeafe" }}
          >
            <div className="space-y-3 lg:space-y-4">
              <div className="text-primary text-3xl font-bold">Upto 25% Off</div>
              <h3 className="text-3xl font-bold">Creamy Muffins</h3>
              <p className="text-lg">Very tasty & creamy vanilla flavour creamy muffins.</p>
              <Link
                href="/shop?category=bakery"
                className="inline-block bg-dark text-white px-6 py-3 text-sm font-semibold uppercase rounded hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
