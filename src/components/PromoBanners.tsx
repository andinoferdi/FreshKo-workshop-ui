import Link from "next/link";

export default function PromoBanners() {
  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* First Banner - Green Theme */}
          <div
            className="banner-ad bg-green-50 rounded-xl p-6 lg:p-8 min-h-[250px] lg:min-h-[300px] flex items-center border border-green-100"
            style={{
              background:
                "url('/images/ad-image-3.png') no-repeat right bottom, var(--green-light)",
            }}
            data-aos="fade-right"
            data-aos-duration="800"
          >
            <div className="text-left max-w-xs">
              <div
                className="text-primary text-3xl font-bold"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Upto 25% Off
              </div>
              <h3
                className="text-xl font-semibold text-gray-900 my-2"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Fresh Organic Vegetables
              </h3>
              <button
                className="inline-block bg-primary text-white px-6 py-3 text-sm font-semibold uppercase rounded hover:bg-green-700 transition-colors"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Second Banner - White Theme */}
          <div
            className="banner-ad bg-white rounded-xl p-6 lg:p-8 min-h-[250px] lg:min-h-[300px] flex items-center border border-gray-200"
            style={{
              background:
                "url('/images/ad-image-4.png') no-repeat right bottom, var(--white)",
            }}
            data-aos="fade-left"
            data-aos-duration="800"
          >
            <div className="text-left max-w-xs">
              <div
                className="text-primary text-3xl font-bold"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Upto 25% Off
              </div>
              <h3
                className="text-xl font-semibold text-gray-900 my-2"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Premium Quality Fruits
              </h3>
              <button
                className="inline-block bg-primary text-white px-6 py-3 text-sm font-semibold uppercase rounded hover:bg-green-700 transition-colors"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
