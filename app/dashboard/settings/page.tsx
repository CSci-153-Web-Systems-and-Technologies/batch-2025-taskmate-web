// app/dashboard/settings/page.tsx
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import DashboardSidebar from '../components/sidebar/page';
import SettingsTabs from '../components/settings-tabs/page'; // Main client component

interface UserProfile {
    // Data pulled from public.profiles
    fullName: string;
    location: string;
    // Data pulled from auth.users (email)
    email: string;
    // Placeholder for avatar
    avatarUrl: string; 
}

/**
 * Fetches the current user's profile and email securely on the server.
 */
async function fetchUserProfile(): Promise<UserProfile | null> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Fetch Profile Data (from public.profiles)
    const { data: profile } = await supabase
        .from('profiles')
        .select('fullname, location')
        .eq('id', user.id)
        .single();
    
    // 2. Fetch Email (from auth.users object)
    const userEmail = user.email || 'N/A';
    
    // 3. Parse Full Name into Given/Last Name (basic example)
    const [firstName = '', lastName = ''] = (profile?.fullname || 'User').split(' ').filter(Boolean);

    return {
        fullName: profile?.fullname || 'User',
        location: profile?.location || 'Not set',
        email: userEmail,
        avatarUrl: '/default-avatar.png',
        // Note: Individual components will handle saving changes
    };
}


export default async function SettingsPage() {
    const profileData = await fetchUserProfile();

    if (!profileData) {
        return <div className="p-10">Please log in to view your settings.</div>;
    }

    return (
        <div className="min-h-screen bg-muted flex">
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
                <p className="text-muted-foreground mb-8">
                    Manage your account's profile information and settings
                </p>

                {/* Main Content Area handled by the client-side Tabs component */}
                <SettingsTabs initialProfileData={profileData} />
            </main>
        </div>
    );
}