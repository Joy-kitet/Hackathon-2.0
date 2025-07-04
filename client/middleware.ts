import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === "https:" && parsedUrl.hostname.includes("supabase")
  } catch {
    return false
  }
}

function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "your-supabase-url" &&
    supabaseAnonKey !== "your-supabase-anon-key" &&
    isValidSupabaseUrl(supabaseUrl) &&
    supabaseAnonKey.startsWith("eyJ")
  )
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Only run Supabase middleware if properly configured
  if (!isSupabaseConfigured()) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    await supabase.auth.getSession()
  } catch (error) {
    console.error("Middleware auth error:", error)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
