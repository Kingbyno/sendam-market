import { type NextRequest, NextResponse } from "next/server"
import { processAutoReleases } from "@/lib/actions/escrow-actions"

export async function GET(request: NextRequest) {
  // Verify the cron secret to ensure this is called by a legitimate cron job
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 })
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("Starting auto-release process...")
    const result = await processAutoReleases()

    if (result.success) {
      console.log(`Auto-release completed. Processed ${result.processedCount} transactions.`)
      return NextResponse.json({
        success: true,
        message: `Processed ${result.processedCount} auto-releases`,
        processedCount: result.processedCount,
      })
    } else {
      console.error("Auto-release failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Auto-release cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
