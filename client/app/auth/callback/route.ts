import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

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

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // Only handle auth callback if Supabase is configured
  if (code && isSupabaseConfigured()) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Auth callback error:", error)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
