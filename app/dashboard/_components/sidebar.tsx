"use client";
import React from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { LayoutDashboard, Calendar, Heart, Settings, LogOut, ArrowLeft, Clock } from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Saved Providers', href: '/dashboard/saved', icon: Heart },
    { name: 'Payment History', href: '/dashboard/payment', icon: Clock },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
    const currentPath = usePathname(); 
    const router = useRouter();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (!error) {
            router.push('/');
            router.refresh(); 
        } else {
            console.error("Error signing out:", error);
            alert("Sign out failed. Please try again.");
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-card p-6 border-r border-border flex flex-col justify-between">
            
            <div>
                <div className="flex items-center space-x-2 mb-8">
                    <Image src="/taskmate-logo.svg" alt="TaskMate Logo Icon" width={30} height={30} priority/>
                    <span className="text-2xl font-bold text-foreground">
                        <span className="text-green-500">Task</span>Mate
                    </span>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        
                        const isDashboard = item.href === '/dashboard';
                        
                        const isActive = isDashboard 
                            ? currentPath === item.href 
                            : currentPath.startsWith(item.href); 
                        
                        return (
                            <Link 
                                key={item.name}
                                href={item.href}
                                className={`flex items-center p-3 rounded-xl font-medium transition ${
                                    isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground hover:bg-muted'
                                }`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-2">
                <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center p-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Log Out</span>
                </button>
                <Link 
                    href="/" 
                    className="w-full flex items-center p-3 rounded-xl font-medium text-muted-foreground hover:bg-muted transition"
                >
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    <span>Back to Home</span>
                </Link>
            </div>
        </aside>
    );
}