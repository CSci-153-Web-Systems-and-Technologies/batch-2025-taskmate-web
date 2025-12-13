import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
<<<<<<< Updated upstream
import CustomerDashboardSidebar from './components/sidebar/page'; // Assuming customer sidebar is here
import ProviderDashboardSidebar from './components/provider-sidebar/page'; // Assuming provider sidebar is here
import DashboardMetrics from './components/metrics/page';
import RecentBookings from './components/recent-bookings/page'; 
=======
import { redirect } from 'next/navigation';
import CustomerDashboardSidebar from './components/sidebar';
import ProviderDashboardSidebar from './components/provider-sidebar';
import RecentBookings from './components/recent-bookings';
import DashboardMetrics from './components/metrics';
>>>>>>> Stashed changes


interface Booking {
    id: string;
<<<<<<< Updated upstream
    customerName: string; // The service provider's name (in the context of the customer view)
=======
    customerName: string;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    // This key holds the monetary value, regardless of whether it's Total Paid or Income
    monetaryValue: number; 
}

interface DashboardData {
=======
    monetaryValue: number;
}

interface DashboardData {
    id: string;
>>>>>>> Stashed changes
    fullName: string;
    role: 'customer' | 'provider';
    metrics: DashboardMetricsData;
    bookings: Booking[];
}

<<<<<<< Updated upstream
// --- Data Fetching Functions ---

/**
 * Fetches the current user's role and basic profile info.
 */
async function fetchUserRole(): Promise<{ role: 'customer' | 'provider', fullName: string } | null> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;
=======

async function fetchUserRole(): Promise<{ id: string, role: 'customer' | 'provider', fullName: string } | null> {
    const supabase = await getServerSupabase();
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/signin'); 
    }
>>>>>>> Stashed changes

    const { data: profile } = await supabase
        .from('profiles')
        .select('fullname, role')
        .eq('id', user.id)
        .single();
    
    if (!profile) return null;

    return {
<<<<<<< Updated upstream
        role: profile.role,
=======
        id: user.id, 
        role: profile.role as 'customer' | 'provider',
>>>>>>> Stashed changes
        fullName: profile.fullname || 'User',
    };
}

<<<<<<< Updated upstream
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
=======
async function fetchDashboardData(userId: string, role: 'customer' | 'provider'): Promise<DashboardMetricsData & { bookings: Booking[] }> {
    const supabase = await getServerSupabase();
    if (!supabase) {
        return { activeBookings: 0, completedBookings: 0, messages: 0, monetaryValue: 0, bookings: [] };
    }
    
    const targetQuery = role === 'customer' ? 'customer_id' : 'provider_id'; 

    const { data: rawBookings, error: bookingError } = await supabase
        .from('bookings')
        .select('id, date, time, status, amount, service_id, provider_id, customer_id')
        .eq(targetQuery, userId)
        .order('date', { ascending: false })
        .limit(3);

    if (bookingError || !rawBookings?.length) {
        if (bookingError) console.error("Error fetching bookings:", bookingError);
        return { activeBookings: 0, completedBookings: 0, messages: 0, monetaryValue: 0, bookings: [] };
    }

    const serviceIds = rawBookings.map(b => b.service_id);
    
    const profileIdsToFetch = rawBookings.map(b => role === 'customer' ? b.provider_id : b.customer_id);

    const { data: servicesData } = await supabase
        .from('services')
        .select('id, title')
        .in('id', serviceIds);

    const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, fullname')
        .in('id', profileIdsToFetch);

    const serviceMap = new Map(servicesData?.map(s => [s.id, s]) || []);
    const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);

    const bookings: Booking[] = rawBookings.map(b => {
        const service = serviceMap.get(b.service_id);
        const counterpartId = role === 'customer' ? b.provider_id : b.customer_id;
        const profile = profileMap.get(counterpartId);

        return {
            id: b.id,
            customerName: profile?.fullname ?? 'Unknown User', 
            serviceTitle: service?.title ?? 'Service Unavailable', 
            date: new Date(b.date).toLocaleDateString(),
            time: b.time,
            status: b.status as Booking['status'],
            amount: b.amount,
        };
    });
    
    const monetaryValue = role === 'provider' ? 25000 : 1500;
    
    return {
        activeBookings: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length,
        completedBookings: 12, 
        messages: 2, 
>>>>>>> Stashed changes
        monetaryValue: monetaryValue, 
        bookings: bookings,
    };
}


<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
export default async function DashboardPage() {
    const userRoleData = await fetchUserRole();
    
    if (!userRoleData) {
<<<<<<< Updated upstream
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


=======
        return <div>Authentication Required</div>;
    }

    const { id, role, fullName } = userRoleData;
    const isProvider = role === 'provider';
    
    const dashboardData = await fetchDashboardData(id, role);
    const SidebarComponent = isProvider ? ProviderDashboardSidebar : CustomerDashboardSidebar;

    const data: DashboardData = {
        id: id,
        fullName: fullName,
        role: role,
        metrics: {
            activeBookings: dashboardData.activeBookings,
            completedBookings: dashboardData.completedBookings,
            messages: dashboardData.messages,
            monetaryValue: dashboardData.monetaryValue,
        },
        bookings: dashboardData.bookings,
    };

>>>>>>> Stashed changes
    return (
        <div className="min-h-screen bg-muted flex">
            <SidebarComponent />
            
            <main className="flex-1 p-8 ml-64"> 
<<<<<<< Updated upstream
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome Back, {data.fullName}!
                </h1>
                <p className="text-muted-foreground mb-8">
                    Manage your bookings and discover new services
=======
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    {isProvider ? `Welcome back, ${fullName}!` : `Hello, ${fullName}!`}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                    {isProvider ? 'Your provider dashboard summary.' : 'Your customer dashboard summary.'}
>>>>>>> Stashed changes
                </p>

                <DashboardMetrics 
                    metrics={data.metrics} 
                    isProvider={isProvider}
                />
<<<<<<< Updated upstream

                <RecentBookings bookings={data.bookings} />
=======
                
                <RecentBookings 
                    bookings={data.bookings} 
                    isProviderView={isProvider} 
                />
>>>>>>> Stashed changes
            </main>
        </div>
    );
}