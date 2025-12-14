"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { User, LogIn, ArrowRight } from 'lucide-react';

export default function AuthStatus() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-lg"></div>; 
    }

    if (user) {
        return (
            <div className="flex items-center space-x-4">
                <Link 
                    href="/dashboard" 
                    className="text-sm font-medium text-primary hover:underline flex items-center"
                >
                    Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link 
                    href="/dashboard/settings" 
                    className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                    <User className="w-5 h-5" /> 
                </Link>
            </div>
        );
    }

    return (
        <nav className="flex items-center space-x-4">
            <Link 
                href="/auth/signin" 
                className="text-sm font-medium text-foreground hover:text-primary transition"
            >
                Login
            </Link>
            <Link 
                href="/auth/signup" 
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
                Sign Up
            </Link>
        </nav>
    );
}