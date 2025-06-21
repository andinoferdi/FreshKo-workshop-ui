"use client"

import { useEffect, useRef } from "react"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  rotation: number
  rotationSpeed: number
}

interface FloatingElementsProps {
  count?: number
  className?: string
}

export default function FloatingElements({ count = 20, className = "" }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<FloatingElement[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating elements
    elementsRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    }))

    // Create DOM elements
    elementsRef.current.forEach((element) => {
      const div = document.createElement("div")
      div.className = "absolute rounded-full bg-gradient-to-br from-primary/20 to-primary/10 pointer-events-none"
      div.style.width = `${element.size}px`
      div.style.height = `${element.size}px`
      div.style.left = `${element.x}px`
      div.style.top = `${element.y}px`
      div.style.opacity = element.opacity.toString()
      div.style.transform = `rotate(${element.rotation}deg)`
      div.id = `floating-${element.id}`
      container.appendChild(div)
    })

    const animate = () => {
      elementsRef.current.forEach((element) => {
        element.y -= element.speed
        element.rotation += element.rotationSpeed

        if (element.y < -element.size) {
          element.y = window.innerHeight + element.size
          element.x = Math.random() * window.innerWidth
        }

        const domElement = document.getElementById(`floating-${element.id}`)
        if (domElement) {
          domElement.style.left = `${element.x}px`
          domElement.style.top = `${element.y}px`
          domElement.style.transform = `rotate(${element.rotation}deg)`
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Clean up DOM elements
      elementsRef.current.forEach((element) => {
        const domElement = document.getElementById(`floating-${element.id}`)
        if (domElement) {
          domElement.remove()
        }
      })
    }
  }, [count])

  return <div ref={containerRef} className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`} />
}
