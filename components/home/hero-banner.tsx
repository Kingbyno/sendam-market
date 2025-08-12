"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Banner } from "@prisma/client"
import Link from "next/link"

interface HeroBannerProps {
  banners: Banner[]
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length)
      }, 5000) // Rotate every 5 seconds
      return () => clearInterval(timer)
    }
  }, [banners.length])

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
        <p>No promotional banners available.</p>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length)
  }

  const currentBanner = banners[currentIndex]

  return (
    <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-lg">
      <Link href={currentBanner.link || "#"} passHref>
        <div className="w-full h-full">
          <Image
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        </div>
      </Link>

      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white p-4">
        <h2 className="text-2xl md:text-4xl font-bold">{currentBanner.title}</h2>
        {currentBanner.subtitle && (
          <p className="mt-2 text-sm md:text-lg">{currentBanner.subtitle}</p>
        )}
        {currentBanner.link && (
          <Button asChild className="mt-4">
            <Link href={currentBanner.link}>Shop Now</Link>
          </Button>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
