"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
// import { Banner } from "@prisma/client"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Banner {
  id: string
  title: string
  imageUrl: string
  link?: string | null // Allow link to be string or null
}

interface PromotionalBannerProps {
  banners: Banner[]
}

export function PromotionalBanner({ banners }: PromotionalBannerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="mobile-padding">
      <Carousel
        plugins={[plugin.current]}
        className="w-full group"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <Card className="overflow-hidden card-modern border-0 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[16/6] md:aspect-[20/7] overflow-hidden">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-4 md:p-8 lg:p-12 text-white">
                    <div className="max-w-2xl animate-fade-in-up">
                      <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 leading-tight">
                        {banner.title}
                      </h2>
                      {banner.link && (
                        <Button 
                          asChild 
                          className="mt-2 md:mt-4 btn-gradient text-sm md:text-base font-semibold px-4 md:px-6 py-2 md:py-3 hover:scale-105 active:scale-95 transition-transform duration-200"
                        >
                          <Link href={banner.link}>
                            Explore Now
                            <span className="ml-2">→</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation buttons with enhanced styling */}
        <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-foreground border-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110" />
        <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-foreground border-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110" />
        
        {/* Custom dots indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {banners.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/60 backdrop-blur-sm animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  )
}
