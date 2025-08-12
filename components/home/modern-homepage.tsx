"use client"

import { useAuth } from "@/hooks/use-auth"
import { ModernHero } from "./modern-hero"
import { ModernFeatures } from "./modern-features"
import { HowItWorks } from "./how-it-works"

export function ModernHomepage() {
  const { user } = useAuth()
  const isSignedIn = !!user

  return (
    <div className="w-full">
      <ModernHero isSignedIn={isSignedIn} />
      <ModernFeatures isSignedIn={isSignedIn} />
      {!isSignedIn && <HowItWorks />}
    </div>
  )
}