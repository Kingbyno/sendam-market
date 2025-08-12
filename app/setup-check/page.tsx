"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SetupCheckPage() {
  const [checks, setChecks] = useState({
    supabase: { url: false, key: false },
    connection: { supabase: null },
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  const checkEnvironmentVariables = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setChecks({
      supabase: {
        url: !!(supabaseUrl && supabaseUrl !== "your_supabase_url" && supabaseUrl.includes("supabase.co")),
        key: !!(supabaseKey && supabaseKey !== "your_supabase_anon_key" && supabaseKey.length > 20),
      },
      connection: { supabase: null },
    })
  }

  const testConnections = async () => {
    setIsLoading(true)

    try {
      // Test Supabase connection
      const supabaseResponse = await fetch("/api/test-supabase")
      const supabaseResult = await supabaseResponse.json()

      setChecks((prev) => ({
        ...prev,
        connection: {
          supabase: supabaseResult.success,
        },
      }))
    } catch (error) {
      console.error("Connection test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyEnvTemplate = () => {
    const template = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAILS=admin@sendam.com,promisetheking@gmail.com`

    navigator.clipboard.writeText(template)
    toast({
      title: "Template copied!",
      description: "Environment variables template copied to clipboard",
    })
  }

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null) return <AlertCircle className="h-4 w-4 text-gray-400" />
    return status ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />
  }

  const allSupabaseConfigured = checks.supabase.url && checks.supabase.key

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Configuration Check</h1>
          <p className="text-gray-600">Verify your environment variables and connections</p>
        </div>

        {/* Overall Status */}
        <Alert
          className={`mb-6 ${allSupabaseConfigured ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuration Status:</strong>{" "}
            {allSupabaseConfigured
              ? "✅ All systems configured correctly!"
              : "⚠️ Some configuration is missing or incomplete"}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Supabase Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon status={allSupabaseConfigured} />
                Supabase Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>SUPABASE_URL</span>
                <Badge variant={checks.supabase.url ? "default" : "destructive"}>
                  {checks.supabase.url ? "✓" : "✗"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>SUPABASE_ANON_KEY</span>
                <Badge variant={checks.supabase.key ? "default" : "destructive"}>
                  {checks.supabase.key ? "✓" : "✗"}
                </Badge>
              </div>
              {checks.connection.supabase !== null && (
                <div className="flex items-center justify-between">
                  <span>Connection Test</span>
                  <Badge variant={checks.connection.supabase ? "default" : "destructive"}>
                    {checks.connection.supabase ? "Connected" : "Failed"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Button onClick={checkEnvironmentVariables}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Check
          </Button>
          <Button onClick={testConnections} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Connections"}
          </Button>
          <Button variant="outline" onClick={copyEnvTemplate}>
            <Copy className="h-4 w-4 mr-2" />
            Copy .env Template
          </Button>
        </div>

        {/* Setup Instructions */}
        {!allSupabaseConfigured && (
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Sanity Setup Required:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>
                      Go to{" "}
                      <a
                        href="https://sanity.io"
                        target="_blank"
                        className="text-blue-600 underline"
                        rel="noreferrer"
                      >
                        sanity.io
                      </a>{" "}
                      and create a project
                    </li>
                    <li>Get your Project ID from the project dashboard</li>
                    <li>
                      ⚠️ <strong>Important:</strong> Project ID must contain only lowercase letters (a-z), numbers
                      (0-9), and dashes (-)
                    </li>
                    <li>Create an API token with Editor permissions</li>
                    <li>Add the credentials to your .env.local file</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Your .env.local should contain:</h4>
                <pre className="text-sm overflow-x-auto">
                  {`NEXT_PUBLIC_SANITY_PROJECT_ID=my-project-123
NEXT_PUBLIC_SANITY_DATASET=production  
SANITY_API_TOKEN=sk...your-token-here`}
                </pre>
                <p className="text-xs text-gray-600 mt-2">⚠️ Project ID format: only a-z, 0-9, and dashes allowed</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
