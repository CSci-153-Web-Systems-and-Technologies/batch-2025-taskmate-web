// lib/supabase/server.ts 
import { createServerClient } from '@supabase/ssr'; 
import { cookies } from 'next/headers'; 
// Function to create and return the server client instance 
async function _createSupabaseServerClient() { 
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; // <--- CORRECTED NAME // Throw error 
    // if keys are missing (this is the check that was failing) 
    if (!supabaseUrl || !supabaseKey) { throw new Error(
         'Missing Supabase URL or Key in environment variables!' 
        ); 
    } 
    return createServerClient( 
        supabaseUrl, // Use the checked URL variable 
        supabaseKey, // Use the checked Key variable 
        { 
            cookies: {
             async getAll() 
                { return (await cookieStore).getAll(); 

                }, 
                async setAll(cookiesToSet) {
                                     try { 
                                        for (const { name, value, options } of cookiesToSet) {
                                            cookieStore.set(name, value, options);
                                        }
                                    } catch (e) {
                                          }
                                    },
                }, 
            } 
        ); 
    }
    /** * Wrapper function for accessing the Supabase client in Server Components. */ 
    export async function getServerSupabase() { 
        return _createSupabaseServerClient(); 
    }