"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
    setName("");

    // Reset success message after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section
      id="newsletter"
      className="bg-gray-50 py-8 lg:py-12 my-8 lg:my-12 rounded-3xl relative overflow-hidden"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full animate-pulse"
          data-aos="zoom-in"
          data-aos-delay="200"
        ></div>
        <div
          className="absolute bottom-10 right-10 w-32 h-32 bg-green-100 rounded-full animate-float"
          data-aos="zoom-in"
          data-aos-delay="400"
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2
          className="text-4xl lg:text-5xl font-bold"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className="text-gray-900">Subscribe to our</span>
          <br />
          <span className="text-primary">Newsletter</span>
        </h2>
        <p
          className="text-gray-600 text-lg lg:text-xl mt-4 mb-8 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Get the latest updates about our fresh products, special offers, and
          healthy recipes delivered to your inbox.
        </p>

        {isSubscribed ? (
          <div
            className="flex items-center justify-center gap-3 text-green-600 text-lg font-medium"
            data-aos="zoom-in"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Thank you for subscribing!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto space-y-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div data-aos="fade-up" data-aos-delay="500">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="600">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div
              className="flex items-start gap-3"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <input
                type="checkbox"
                id="newsletter-consent"
                className="mr-2 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                required
              />
              <label
                htmlFor="newsletter-consent"
                className="text-sm text-gray-600 text-left"
              >
                I agree to receive marketing emails and understand I can
                unsubscribe at any time.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 text-lg font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Subscribe Now</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
