import { useAuth } from "@/hooks/use-auth"

export function SupabaseStatus() {
  const { isSupabaseConfigured } = useAuth()

  // Return null or an empty fragment if you want to hide the alerts entirely.
  if (!isSupabaseConfigured) {
    return null
  }

  // No alert for the Supabase connection; this just returns nothing.
  return null
}
