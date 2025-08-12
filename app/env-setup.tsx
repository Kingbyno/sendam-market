"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EnvSetup() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)

  const handleSaveToEnv = () => {
    // This is just for demonstration - in a real app, you'd need a server endpoint to save these
    alert(
      "In a real application, these values would be saved to your .env.local file. For now, please add them manually.",
    )
    setShowInstructions(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Sendam Marketplace Setup</CardTitle>
          <CardDescription>Configure your environment variables to get started with Sendam Marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Supabase Configuration</h3>
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <Input
                id="supabase-url"
                placeholder="https://xxxxxxxxxxxx.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabase-key">Supabase Anon Key</Label>
              <Input
                id="supabase-key"
                placeholder="eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
              <p className="text-sm text-gray-500">Find these in your Supabase project under Settings → API</p>
            </div>
          </div>

          {showInstructions && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Manual Setup Instructions</h4>
              <p className="text-sm text-blue-700 mb-3">
                Create a <code className="bg-blue-100 px-1 py-0.5 rounded">.env.local</code> file in your project root
                with the following content:
              </p>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
                {`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl || "your_supabase_url"}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey || "your_supabase_anon_key"}`}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveToEnv} className="w-full">
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
