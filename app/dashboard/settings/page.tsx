import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CustomerDashboardSidebar from '../_components/sidebar'; 
import ProviderDashboardSidebar from '../_components/providerSidebar'; 
import SettingsTabs from '../_components/settingsTabs'; 

interface UserProfile {
    fullName: string;
    username: string;
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

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
    .from('profiles')
    .select('fullname, username, role, is_active, rating, location, avatar_url')
    .eq('id', user.id)
    .single();
    
    if (!profile) return null;
    
    const userEmail = user.email || 'N/A';
    
    return {
        fullName: profile.fullname || 'User',
        username: profile.username || '', 
        location: profile.location || '',
        email: userEmail,
        avatarUrl: profile.avatar_url || '/default-avatar.png', 
        role: profile.role,
    };
}


export default async function SettingsPage() {
    const profileData = await fetchUserProfile();

    if (!profileData) {
        return <div className="p-10 text-red-500">Error: Your profile data could not be loaded.</div>;
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