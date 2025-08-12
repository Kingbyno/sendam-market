"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Settings, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ConfigStatus {
  supabase: boolean
}

export function ConfigurationBanner() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({ supabase: false })
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const hasSupabaseUrl = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasSupabaseKey = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setConfigStatus({
        supabase: hasSupabaseUrl && hasSupabaseKey,
      })
    } catch (error) {
      console.warn("Could not check configuration:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFullyConfigured = configStatus.supabase
  const hasPartialConfig = configStatus.supabase

  // Don't show banner if fully configured or user dismissed it
  if (isLoading || isFullyConfigured || !isVisible) {
    return null
  }

  return (
    <Alert className="rounded-none border-l-0 border-r-0 border-t-0 bg-amber-50 border-amber-200">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <span className="text-amber-800">
            {hasPartialConfig
              ? "Setup incomplete - some features may not work properly"
              : "Setup required - configure your services to get started"}
          </span>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {configStatus.supabase ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <X className="h-3 w-3 text-red-600" />
              )}
              <span className={configStatus.supabase ? "text-green-700" : "text-red-700"}>Supabase</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="h-7">
            <Link href="/setup-check">
              <Settings className="h-3 w-3 mr-1" />
              Setup Guide
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="h-7 w-7 p-0 border-amber-300/60 bg-amber-50/50 hover:bg-amber-100/70 hover:border-amber-400/80 transition-all duration-200 shadow-sm" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4 text-amber-700 hover:text-amber-800" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
