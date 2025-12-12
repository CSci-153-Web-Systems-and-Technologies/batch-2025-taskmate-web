import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import CustomerDashboardSidebar from './components/sidebar/page'; // Assuming customer sidebar is here
import ProviderDashboardSidebar from './components/provider-sidebar/page'; // Assuming provider sidebar is here
import DashboardMetrics from './components/metrics/page';
import RecentBookings from './components/recent-bookings/page'; 


interface Booking {
    id: string;
    customerName: string; // The service provider's name (in the context of the customer view)
    serviceTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed';
    amount: number;
}

interface DashboardMetricsData {
    activeBookings: number;
    completedBookings: number;
    messages: number;
    // This key holds the monetary value, regardless of whether it's Total Paid or Income
    monetaryValue: number; 
}

interface DashboardData {
    fullName: string;
    role: 'customer' | 'provider';
    metrics: DashboardMetricsData;
    bookings: Booking[];
}

// --- Data Fetching Functions ---

/**
 * Fetches the current user's role and basic profile info.
 */
async function fetchUserRole(): Promise<{ role: 'customer' | 'provider', fullName: string } | null> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('fullname, role')
        .eq('id', user.id)
        .single();
    
    if (!profile) return null;

    return {
        role: profile.role,
        fullName: profile.fullname || 'User',
    };
}

/**
 * Fetches common dashboard data (metrics and recent bookings).
 * NOTE: In a real app, this function would be split or query differently based on role.
 */
async function fetchDashboardData(userId: string, role: 'customer' | 'provider'): Promise<DashboardMetricsData & { bookings: Booking[] }> {
    const supabase = await getServerSupabase();
    
    const targetQuery = role === 'customer' ? 'user_id' : 'provider_id';

    // 1. Fetch RECENT Bookings (Limit to last 3 for dashboard display)
    const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
            id, date, time, status, amount, service_title,
            provider:profiles!fk_provider (fullname) // Assuming provider profile is linked
        `)
        .eq(targetQuery, userId) // Filter by current user (customer or provider)
        .order('date', { ascending: false })
        .limit(3);

    if (error) {
        console.error("Error fetching recent bookings:", error);
        return { activeBookings: 0, completedBookings: 0, messages: 0, monetaryValue: 0, bookings: [] };
    }
    
    const bookings: Booking[] = bookingData.map(b => ({
        id: b.id,
        customerName: b.provider?.fullname || 'Name Missing', 
        serviceTitle: b.service_title,
        date: new Date(b.date).toLocaleDateString(),
        time: b.time,
        status: b.status as Booking['status'],
        amount: b.amount,
    }));
    
    const monetaryValue = role === 'provider' ? 25000 : 1500;
    return {
        activeBookings: bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length,
        completedBookings: 12,
        messages: 2,
        monetaryValue: monetaryValue, 
        bookings: bookings,
    };
}



export default async function DashboardPage() {
    const userRoleData = await fetchUserRole();
    
    if (!userRoleData) {
        return <div className="p-10">Please log in to view your dashboard.</div>;
    }

    const { role, fullName } = userRoleData;
    const isProvider = role === 'provider';
    
    const { id } = await (await getServerSupabase()).auth.getUser().then(res => res.data.user || { id: null });
    
    const dashboardData = await fetchDashboardData(id!, role);
    
    const SidebarComponent = isProvider ? ProviderDashboardSidebar : CustomerDashboardSidebar;

    const data: DashboardData = {
        fullName: fullName,
        role: role,
        metrics: dashboardData,
        bookings: dashboardData.bookings,
    };


    return (
        <div className="min-h-screen bg-muted flex">
            <SidebarComponent />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome Back, {data.fullName}!
                </h1>
                <p className="text-muted-foreground mb-8">
                    Manage your bookings and discover new services
                </p>

                <DashboardMetrics 
                    metrics={data.metrics} 
                    isProvider={isProvider}
                />

                <RecentBookings bookings={data.bookings} />
            </main>
        </div>
    );
}