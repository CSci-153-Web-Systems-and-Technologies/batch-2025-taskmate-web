import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import { redirect } from 'next/navigation';
import AllBookingsTable from '@/app/dashboard/components/recent-bookings'; 
import CustomerDashboardSidebar from '../components/sidebar'; 

interface Booking {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Rejected' | 'Cancelled';
    amount: number;
}

async function fetchCustomerBookings(): Promise<Booking[]> {
    const supabase = await getServerSupabase();
    if (!supabase) return []; 
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/signin');

    const { data: rawBookings, error } = await supabase
        .from('bookings')
        .select('id, date, time, status, amount, service_id, provider_id')
        .eq('customer_id', user.id)
        .order('date', { ascending: false });

    if (error || !rawBookings?.length) return [];
    
    const serviceIds = rawBookings.map(b => b.service_id);
    const providerIds = rawBookings.map(b => b.provider_id);

    const { data: services } = await supabase.from('services').select('id, title').in('id', serviceIds);
    const { data: profiles } = await supabase.from('profiles').select('id, fullname').in('id', providerIds);

    const serviceMap = new Map(services?.map(s => [s.id, s]) || []);
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    return rawBookings.map(b => {
        const service = serviceMap.get(b.service_id);
        const provider = profileMap.get(b.provider_id);

        return {
            id: b.id,
            customerName: provider?.fullname || 'Unknown Provider', 
            serviceTitle: service?.title || 'Service Unavailable',
            date: new Date(b.date).toLocaleDateString(),
            time: b.time,
            status: b.status,
            amount: b.amount,
        };
    });
}

export default async function CustomerBookingsPage() {
    const bookings = await fetchCustomerBookings();

    return (
        <div className="min-h-screen bg-muted flex">
            <CustomerDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
                <p className="text-muted-foreground mb-8">
                    Track the status of your service requests.
                </p>

                <AllBookingsTable bookings={bookings} isProviderView={false} /> 
            </main>
        </div>
    );
}