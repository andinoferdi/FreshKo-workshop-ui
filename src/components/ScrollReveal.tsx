"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  distance?: string
  className?: string
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 800,
  distance = "50px",
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = "1"
          element.style.transform = "translate(0, 0)"
        }
      },
      { threshold: 0.1 },
    )

    // Set initial styles
    element.style.opacity = "0"
    element.style.transition = `all ${duration}ms ease-out ${delay}ms`

    switch (direction) {
      case "up":
        element.style.transform = `translateY(${distance})`
        break
      case "down":
        element.style.transform = `translateY(-${distance})`
        break
      case "left":
        element.style.transform = `translateX(${distance})`
        break
      case "right":
        element.style.transform = `translateX(-${distance})`
        break
    }

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [direction, delay, duration, distance])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
