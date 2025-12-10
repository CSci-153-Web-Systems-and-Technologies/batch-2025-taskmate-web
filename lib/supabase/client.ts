// lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

// Export the initialized client variable directly, named 'supabase'.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ⚠️ NOTE: The error shows your ENV key is NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
  // I am updating this code snippet to use the variable that is present in your .env file.
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)