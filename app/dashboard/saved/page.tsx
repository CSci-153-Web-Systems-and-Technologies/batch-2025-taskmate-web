import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import DashboardSidebar from '../_components/sidebar';
import SavedProvidersList from '../_components/savedProvidersList'; 

interface ProviderData {
    id: string;
    fullName: string;
    expertTitle: string; 
    rating: number;
    hourlyRate: number;
    availability: 'Available' | 'Busy';
    username: string; 
}

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
}

export default async function SavedProvidersPage() {
    const savedProviders = await fetchSavedProviders();

    return (
        <div className="min-h-screen bg-muted flex">
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Saved Providers</h1>
                <p className="text-muted-foreground mb-8">Quickly access the best service providers you've favorited.</p>

                {savedProviders.length === 0 ? (
                    <div className="p-10 text-center bg-card rounded-xl border border-border">
                        <p className="text-muted-foreground">You haven't saved any providers yet.</p>
                    </div>
                ) : (
                    <SavedProvidersList providers={savedProviders} />
                )}
            </main>
        </div>
    );
}