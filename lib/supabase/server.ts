import { createServerClient } from '@supabase/ssr'; 
import { cookies } from 'next/headers'; 
async function _createSupabaseServerClient() { 
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) { throw new Error(
         'Missing Supabase URL or Key in environment variables!' 
        ); 
    } 
    return createServerClient( 
        supabaseUrl,
        supabaseKey,
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
    export async function getServerSupabase() { 
        return _createSupabaseServerClient(); 
    }