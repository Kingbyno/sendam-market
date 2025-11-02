import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/options'

export async function GET() {
  const session = await getServerSession(authOptions)
  return new Response(JSON.stringify(session ?? null, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
