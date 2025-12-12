// app/dashboard/saved/page.tsx
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import DashboardSidebar from '../components/sidebar/page';
import SavedProvidersList from '../components/saved-providers-list/page'; 

interface ProviderData {
    id: string;
    fullName: string;
    expertTitle: string; 
    rating: number;
    hourlyRate: number;
    availability: 'Available' | 'Busy';
    username: string; 
}

// Temporary interface to correctly map the raw Supabase query result
interface FavoriteQueryData {
    // 'provider' is the alias used in the .select() call
    provider: {
        id: string;
        fullname: string; // Database column name
        username: string;
        rating: number;
        services: { price: number; title: string }[];
    } | null;
}


/**
 * Fetches the list of saved providers for the current user.
 */
async function fetchSavedProviders(): Promise<ProviderData[]> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // 1. Query the 'favorites' table to find all favorited provider_ids
    const { data, error } = await supabase
        .from('favorites')
        .select(`
            provider:profiles!fk_provider (  // Aliases the joined profile data as 'provider'
                id, fullname, username, rating, 
                services (price, title) 
            )
        `)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching saved providers:", error);
        return [];
    }

    // 2. Transform and flatten the data
    return (data as unknown as FavoriteQueryData[])
        .map(item => item.provider)
        .filter((provider): provider is NonNullable<FavoriteQueryData['provider']> => provider !== null) 
        .map(provider => ({
            id: provider.id,
            // Map the DB column 'fullname' to the frontend interface 'fullName'
            fullName: provider.fullname, 
            username: provider.username,
            rating: provider.rating || 0,
            
            // Mocking or using the first related service data:
            hourlyRate: provider.services?.[0]?.price || 500, 
            expertTitle: provider.services?.[0]?.title || 'General Provider', 
            availability: (Math.random() > 0.5 ? 'Available' : 'Busy') as 'Available' | 'Busy', 
        })) as ProviderData[];
}

export default async function SavedProvidersPage() {
    const savedProviders = await fetchSavedProviders();

    return (
        <div className="min-h-screen bg-muted flex">
            {/* The Sidebar component is located in the sibling 'components/sidebar' folder */}
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Saved Providers</h1>
                <p className="text-muted-foreground mb-8">Quickly access the best service providers you've favorited.</p>

                {/* The list component renders the UI */}
                <SavedProvidersList providers={savedProviders} />
            </main>
        </div>
    );
}