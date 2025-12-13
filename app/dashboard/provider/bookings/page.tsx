<<<<<<< Updated upstream
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import ProviderDashboardSidebar from '@/app/dashboard/components/provider-sidebar/page';
import RecentBookingsTable from '@/app/dashboard/components/recent-bookings/page';

interface ProviderBooking extends Booking {
    actionButtons: boolean;
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


async function fetchProviderBookings(): Promise<ProviderBooking[]> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
            id, date, time, status, amount, service_title,
            customer:profiles!fk_customer (fullname) // Select customer's name
        `)
        .eq('provider_id', user.id)
        .order('date', { ascending: false });

    if (error) {
        console.error("Error fetching provider bookings:", error);
        return [];
    }

    return bookingData.map(b => ({
        id: b.id,
        customerName: b.customer?.fullname || 'Customer',
        serviceTitle: b.service_title,
        date: new Date(b.date).toLocaleDateString(),
        time: b.time,
        status: b.status as Booking['status'],
        amount: b.amount,
        actionButtons: b.status === 'Pending',
    })) as ProviderBooking[];
=======
import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import { redirect } from 'next/navigation';
import AllBookingsTable from '@/app/dashboard/components/recent-bookings';
import ProviderDashboardSidebar from '../../components/provider-sidebar'; 

interface Booking {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Rejected' | 'Cancelled';
    amount: number;
}

async function fetchProviderBookings(): Promise<Booking[]> {
    const supabase = await getServerSupabase();
    if (!supabase) return []; 
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/signin');

    const { data: rawBookings, error } = await supabase
        .from('bookings')
        .select('id, date, time, status, amount, service_id, customer_id')
        .eq('provider_id', user.id) // Filter by Provider ID
        .order('date', { ascending: false });

    if (error || !rawBookings?.length) return [];
    
    const serviceIds = rawBookings.map(b => b.service_id);
    const customerIds = rawBookings.map(b => b.customer_id);

    const { data: services } = await supabase.from('services').select('id, title').in('id', serviceIds);
    const { data: profiles } = await supabase.from('profiles').select('id, fullname').in('id', customerIds);

    const serviceMap = new Map(services?.map(s => [s.id, s]) || []);
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    return rawBookings.map(b => {
        const service = serviceMap.get(b.service_id);
        const customer = profileMap.get(b.customer_id);

        return {
            id: b.id,
            customerName: customer?.fullname || 'Unknown Customer', 
            serviceTitle: service?.title || 'Service Unavailable',
            date: new Date(b.date).toLocaleDateString(),
            time: b.time,
            status: b.status,
            amount: b.amount,
        };
    });
>>>>>>> Stashed changes
}

export default async function ProviderBookingsPage() {
    const bookings = await fetchProviderBookings();

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
<<<<<<< Updated upstream
                <h1 className="text-3xl font-bold text-foreground mb-2">Incoming Bookings</h1>
                <p className="text-muted-foreground mb-8">Manage all your pending, confirmed, and completed service requests.</p>
                
                <RecentBookingsTable bookings={bookings} isProviderView={true} /> 

                {bookings.length === 0 && (
                    <div className="text-center p-10 bg-card rounded-xl mt-4">
                        <p className="text-lg text-muted-foreground">You have no incoming bookings yet.</p>
                    </div>
                )}
=======
                <h1 className="text-3xl font-bold text-foreground mb-2">Incoming Requests</h1>
                <p className="text-muted-foreground mb-8">
                    Manage your incoming jobs and appointments.
                </p>

                <AllBookingsTable bookings={bookings} isProviderView={true} /> 
>>>>>>> Stashed changes
            </main>
        </div>
    );
}