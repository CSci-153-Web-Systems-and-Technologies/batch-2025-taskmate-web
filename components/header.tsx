import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSupabase } from '@/lib/supabase/server';

async function fetchUserData() {
    const supabase = getServerSupabase(); 
    
    if (!supabase) {
        console.error("Supabase client failed to initialize.");
        return null;
    }

    const { data: { user } } = await (await supabase).auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile, error } = await (await supabase)
        .from('profiles')
        .select('fullname, role') 
        .eq('id', user.id)
        .single();
    
    if (error || !profile) {
        console.error("Error fetching profile:", error);
        return null; 
    }

    return {
        isLoggedIn: true,
        fullName: profile.fullname || 'User',
        role: profile.role,
        initials: (profile.fullname || 'U')[0],
    };
}

export default async function Header() {
    const userData = await fetchUserData();

    const AuthContent = () => {
        if (!userData || !userData.isLoggedIn) {
            return (
                <div className="space-x-4 flex items-center">
                    <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary">
                        Log In
                    </Link>
                    <Link href="/signup" className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
                        Sign Up
                    </Link>
                </div>
            );
        }

        return (
            <Link href="/dashboard" className="flex items-center space-x-3 cursor-pointer p-1 rounded-lg hover:bg-muted transition">
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                    userData.role === 'provider' ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                    {userData.initials} 
                </div>
                
                <div className="text-right">
                    <span className="text-sm font-medium block leading-none">{userData.fullName}</span>
                    <span className={`text-xs block leading-none ${
                        userData.role === 'provider' ? 'text-green-500' : 'text-muted-foreground'
                    }`}>
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    </span>
                </div>
            </Link>
        );
    };

    return (
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
            
            <Link href="/" className="flex items-center space-x-2">
                <Image src="/taskmate-logo.svg" alt="TaskMate Logo Icon" width={30} height={30} priority/>
                <span className="text-2xl font-bold text-foreground">
                    <span className="text-green-500">Task</span>Mate
                </span>
            </Link>

            <nav className="hidden md:flex space-x-6 text-sm font-medium">
                <Link href="/">Home</Link>
                <Link href="/category">Category</Link>
            </nav>

            <AuthContent />
        </header>
    );
}