// lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Function to create and return the server client instance
async function _createSupabaseServerClient() {
    const cookieStore = cookies(); 

    // Read variables into local constants for easier checking
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; // <--- CORRECTED NAME

    // Throw error if keys are missing (this is the check that was failing)
    if (!supabaseUrl || !supabaseKey) {
       throw new Error(
          'Missing Supabase URL or Key in environment variables!'
       );
    }
    
    return createServerClient(
        supabaseUrl, // Use the checked URL variable
        supabaseKey, // Use the checked Key variable
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                    } catch (e) {
                        // This is ignored if called from a Server Component.
                    }
                },
            },
        }
    );
}

/**
 * Wrapper function for accessing the Supabase client in Server Components.
 */
export async function getServerSupabase() {
    return _createSupabaseServerClient();
}