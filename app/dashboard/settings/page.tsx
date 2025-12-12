import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import CustomerDashboardSidebar from '../components/sidebar/page'; 
import ProviderDashboardSidebar from '../components/provider-sidebar/page'; 
import SettingsTabs from '../components/settings-tabs/page'; 
interface UserProfile {
    fullName: string;
    location: string;
    email: string;
    avatarUrl: string; 
    role: 'customer' | 'provider';
}

async function fetchUserProfile(): Promise<UserProfile | null> {
    const supabase = await getServerSupabase(); 


    if (!supabase) {
        console.error("Supabase client failed to initialize in Settings fetchUserProfile.");
        return null;
    }
    

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('fullname, location, role')
        .eq('id', user.id)
        .single();
    
    if (!profile) return null;
    
    const userEmail = user.email || 'N/A';
    
    return {
        fullName: profile.fullname || 'User',
        location: profile.location || 'Not set',
        email: userEmail,
        avatarUrl: '/default-avatar.png',
        role: profile.role,
    };
}


export default async function SettingsPage() {
    const profileData = await fetchUserProfile();

    if (!profileData) {
        return <div className="p-10">Please log in to view your settings.</div>;
    }
    
    const isProvider = profileData.role === 'provider';
    const SidebarComponent = isProvider ? ProviderDashboardSidebar : CustomerDashboardSidebar;

    return (
        <div className="min-h-screen bg-muted flex">
            <SidebarComponent />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
                <p className="text-muted-foreground mb-8">
                    Manage your account's profile information and settings
                </p>

                <SettingsTabs initialProfileData={profileData} />
            </main>
        </div>
    );
}