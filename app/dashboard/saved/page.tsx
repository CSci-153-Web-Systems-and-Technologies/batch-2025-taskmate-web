<<<<<<< Updated upstream
// app/dashboard/saved/page.tsx
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import DashboardSidebar from '../components/sidebar/page';
import SavedProvidersList from '../components/saved-providers-list/page'; 
=======
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import DashboardSidebar from '../components/sidebar';
import SavedProvidersList from '../components/saved-providers-list'; 
>>>>>>> Stashed changes

interface ProviderData {
    id: string;
    fullName: string;
    expertTitle: string; 
    rating: number;
    hourlyRate: number;
    availability: 'Available' | 'Busy';
    username: string; 
}

<<<<<<< Updated upstream
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
=======
async function fetchSavedProviders(): Promise<ProviderData[]> {
    const supabase = await getServerSupabase();
    if (!supabase) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('provider_id')
        .eq('user_id', user.id);

    if (favError || !favorites?.length) {
        if (favError) console.error("Error fetching favorites:", favError);
        return [];
    }

    const providerIds = favorites.map(f => f.provider_id);

    const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, fullname, username, rating')
        .in('id', providerIds);

    const { data: servicesData } = await supabase
        .from('services')
        .select('id, title, price, provider_id')
        .in('provider_id', providerIds);

    const serviceMap = new Map();
    servicesData?.forEach(s => {
        if (!serviceMap.has(s.provider_id)) {
            serviceMap.set(s.provider_id, s);
        }
    });

    const providers: ProviderData[] = (profilesData || []).map(profile => {
        const service = serviceMap.get(profile.id);

        return {
            id: profile.id,
            fullName: profile.fullname || 'Unknown Provider',
            username: profile.username || 'user',
            rating: profile.rating || 0,
            
            hourlyRate: service?.price || 500,
            expertTitle: service?.title || 'General Service Provider',
            
            availability: (Math.random() > 0.3 ? 'Available' : 'Busy'), 
        };
    });

    return providers;
>>>>>>> Stashed changes
}

export default async function SavedProvidersPage() {
    const savedProviders = await fetchSavedProviders();

    return (
        <div className="min-h-screen bg-muted flex">
<<<<<<< Updated upstream
            {/* The Sidebar component is located in the sibling 'components/sidebar' folder */}
=======
>>>>>>> Stashed changes
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Saved Providers</h1>
                <p className="text-muted-foreground mb-8">Quickly access the best service providers you've favorited.</p>

<<<<<<< Updated upstream
                {/* The list component renders the UI */}
                <SavedProvidersList providers={savedProviders} />
=======
                {savedProviders.length === 0 ? (
                    <div className="p-10 text-center bg-card rounded-xl border border-border">
                        <p className="text-muted-foreground">You haven't saved any providers yet.</p>
                    </div>
                ) : (
                    <SavedProvidersList providers={savedProviders} />
                )}
>>>>>>> Stashed changes
            </main>
        </div>
    );
}