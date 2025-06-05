"use client"

import type React from "react"

import { useState } from "react"

export default function NewsletterSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subscribe: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <section className="section-spacing">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-gray-200 py-8 lg:py-12 my-8 lg:my-12 rounded-3xl relative overflow-hidden"
          style={{ backgroundImage: "url('/images/bg-leaves-img-pattern.png')", backgroundRepeat: "no-repeat" }}
        >
          <div className="w-[90%] mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Get <span className="text-primary">25% Discount</span> on your first purchase
                </h2>
                <p className="text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictumst amet, metus, sit massa posuere
                  maecenas. At tellus ut nunc amet vel egestas.
                </p>
              </div>

              <div>
                <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="abc@mail.com"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="subscribe"
                      name="subscribe"
                      checked={formData.subscribe}
                      onChange={handleChange}
                      className="mr-2 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="subscribe" className="text-sm">
                      Subscribe to the newsletter
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-dark text-white py-3 text-lg font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
