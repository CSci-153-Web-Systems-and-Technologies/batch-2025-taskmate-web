// app/dashboard/page.tsx
import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import DashboardSidebar from './components/sidebar/page';
import DashboardMetrics from './components/metrics/page';
import RecentBookings from './components/recent-bookings/page';

interface CustomerData {
    fullName: string;
    metrics: {
        activeBookings: number;
        completedBookings: number;
        messages: number;
        paymentHistory: number;
    };
    bookings: Booking[];
}

interface Booking {
    id: string;
    customerName: string; 
    serviceTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed';
    amount: number;
}

async function fetchCustomerDashboardData(): Promise<CustomerData | null> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('fullname') 
        .eq('id', user.id)
        .single();
        
    const customerName = profile?.fullname || 'Customer';

    const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
            id, date, time, status, amount, service_title,
            provider:profiles!fk_provider (fullname)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3);

    if (error) {
        console.error("Error fetching recent bookings:", error);
        return {
            fullName: customerName,
            metrics: { activeBookings: 0, completedBookings: 0, messages: 0, paymentHistory: 0 },
            bookings: [],
        };
    }
    
    const bookings: Booking[] = bookingData.map(b => ({
        id: b.id,
        customerName: b.provider?.fullname || 'Provider',
        serviceTitle: b.service_title,
        date: new Date(b.date).toLocaleDateString(),
        time: b.time,
        status: b.status as Booking['status'],
        amount: b.amount,
    }));
    
    const metrics = {
        activeBookings: bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length,
        completedBookings: 0,
        messages: 0,
        paymentHistory: 0,
    };

    return {
        fullName: customerName,
        metrics: metrics,
        bookings: bookings,
    };
}

export default async function DashboardPage() {
    const data = await fetchCustomerDashboardData();

    if (!data) {
        return <div className="p-10">Please log in to view your dashboard.</div>;
    }

    return (
        <div className="min-h-screen bg-muted flex">
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome Back, {data.fullName}!
                </h1>
                <p className="text-muted-foreground mb-8">
                    Manage your bookings and discover new services
                </p>

                <DashboardMetrics metrics={data.metrics} />

                <RecentBookings bookings={data.bookings} />
            </main>
        </div>
    );
}