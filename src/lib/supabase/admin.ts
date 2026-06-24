import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Admin client using service role key — bypasses RLS
// Only use in API routes, never expose to the client
// Lazy-initialized to avoid crashing during build when env vars aren't set

let _admin: SupabaseClient | null = null;

function getAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return _admin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getAdmin() as any)[prop];
  },
});