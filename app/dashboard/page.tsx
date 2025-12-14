import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import { redirect } from 'next/navigation';
import CustomerDashboardSidebar from './_components/sidebar';
import ProviderDashboardSidebar from './_components/providerSidebar';
import RecentBookings from './_components/recentBookings';
import DashboardMetrics from './_components/metrics';


interface Booking {
    id: string;
    customerName: string;
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
    monetaryValue: number;
}

interface DashboardData {
    id: string;
    fullName: string;
    role: 'customer' | 'provider';
    metrics: DashboardMetricsData;
    bookings: Booking[];
}


async function fetchUserRole(): Promise<{ id: string, role: 'customer' | 'provider', fullName: string } | null> {
    const supabase = await getServerSupabase();
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/signin'); 
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('fullname, role')
        .eq('id', user.id)
        .single();
    
    if (!profile) return null;

    return {
        id: user.id, 
        role: profile.role as 'customer' | 'provider',
        fullName: profile.fullname || 'User',
    };
}

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
        monetaryValue: monetaryValue, 
        bookings: bookings,
    };
}


export default async function DashboardPage() {
    const userRoleData = await fetchUserRole();
    
    if (!userRoleData) {
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

    return (
        <div className="min-h-screen bg-muted flex">
            <SidebarComponent />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    {isProvider ? `Welcome back, ${fullName}!` : `Hello, ${fullName}!`}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                    {isProvider ? 'Your provider dashboard summary.' : 'Your customer dashboard summary.'}
                </p>

                <DashboardMetrics 
                    metrics={data.metrics} 
                    isProvider={isProvider}
                />
                
                <RecentBookings 
                    bookings={data.bookings} 
                    isProviderView={isProvider} 
                />
            </main>
        </div>
    );
}