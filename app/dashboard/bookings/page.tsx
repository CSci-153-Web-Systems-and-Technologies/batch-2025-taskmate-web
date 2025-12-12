import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import DashboardSidebar from '../components/sidebar/page';
import RecentBookings from '../components/recent-bookings/page'; 

interface Booking {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed';
    amount: number;
}

async function fetchAllBookings(): Promise<Booking[]> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
            id, date, time, status, amount, service_title,
            provider:profiles!fk_provider (fullname)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

    if (error) {
        console.error("Error fetching all bookings:", error);
        return [];
    }

    return bookingData.map(b => ({
        id: b.id,
        customerName: b.provider?.fullname || 'Provider',
        serviceTitle: b.service_title,
        date: new Date(b.date).toLocaleDateString(),
        time: b.time,
        status: b.status as Booking['status'],
        amount: b.amount,
    }));
}


export default async function MyBookingsPage() {
    const allBookings = await fetchAllBookings();

    return (
        <div className="min-h-screen bg-muted flex">
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings History</h1>
                <p className="text-muted-foreground mb-8">View all pending, confirmed, and completed service requests in full detail.</p>
                
                <RecentBookings bookings={allBookings} />
                
                {allBookings.length === 0 && (
                    <div className="text-center p-10 bg-card rounded-xl mt-4">
                        <p className="text-lg text-muted-foreground">You have no booking history yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}