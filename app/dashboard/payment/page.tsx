import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
<<<<<<< Updated upstream
import DashboardSidebar from '../components/sidebar/page';
import PaymentHistoryList from '../components/payment-history-list/page';
=======
import DashboardSidebar from '../components/sidebar';
import PaymentHistoryList from '../components/payment-history-list';
>>>>>>> Stashed changes

interface TransactionData {
    id: string;
    providerFullName: string;
    providerUsername: string;
    serviceTitle: string;
    amount: number;
    transactionDate: string; 
    rating: number;
    hourlyRate: number;
}

async function fetchPaymentHistory(): Promise<TransactionData[]> {
    const supabase = await getServerSupabase();
<<<<<<< Updated upstream
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: transactionData, error } = await supabase
        .from('transactions')
        .select(`
            id, amount, service_title, transaction_date,
            provider:profiles!fk_provider_id_fkey (fullname, username, rating)
        `)
        .eq('user_id', user.id) 
        .order('transaction_date', { ascending: false });

    if (error) {
        console.error("Error fetching payment history:", error);
        return [];
    }

    // Transform data
    return transactionData.map(t => ({
        id: t.id,
        providerFullName: t.provider?.fullname || 'Provider',
        providerUsername: t.provider?.username || 'N/A',
        serviceTitle: t.service_title,
        amount: t.amount,
        transactionDate: new Date(t.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        rating: t.provider?.rating || 0,
        hourlyRate: 500, 
    })) as TransactionData[];
=======
    if (!supabase) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: rawTransactions, error } = await supabase
        .from('transactions')
        .select('id, amount_paid, transaction_date, provider_id, booking_id') 
        .eq('customer_id', user.id)
        .order('transaction_date', { ascending: false });

    if (error || !rawTransactions?.length) {
        if (error) console.error("Error fetching payment history:", error);
        return [];
    }

    const providerIds = rawTransactions.map(t => t.provider_id);
    const bookingIds = rawTransactions.map(t => t.booking_id);

    const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, fullname, username, rating')
        .in('id', providerIds);

    const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, service_id')
        .in('id', bookingIds);

    const serviceIds = bookingsData?.map(b => b.service_id) || [];
    const { data: servicesData } = await supabase
        .from('services')
        .select('id, title')
        .in('id', serviceIds);


    const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);
    const bookingMap = new Map(bookingsData?.map(b => [b.id, b]) || []);
    const serviceMap = new Map(servicesData?.map(s => [s.id, s]) || []);

    const history: TransactionData[] = rawTransactions.map(t => {
        const provider = profileMap.get(t.provider_id);
        
        const booking = bookingMap.get(t.booking_id);
        const service = booking ? serviceMap.get(booking.service_id) : null;

        return {
            id: t.id,
            providerFullName: provider?.fullname || 'Unknown Provider',
            providerUsername: provider?.username || 'user',
            serviceTitle: service?.title || 'Service Payment', 
            transactionDate: new Date(t.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            rating: provider?.rating || 0,
            hourlyRate: 500,
            amount: t.amount_paid,
        };
    });

    return history;
>>>>>>> Stashed changes
}

export default async function PaymentHistoryPage() {
    const paymentHistory = await fetchPaymentHistory();

    return (
        <div className="min-h-screen bg-muted flex">
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Payment History</h1>
                <p className="text-muted-foreground mb-8">View a complete list of all your past transactions and payments.</p>

<<<<<<< Updated upstream
                <PaymentHistoryList history={paymentHistory} />
=======
                {paymentHistory.length === 0 ? (
                    <div className="p-10 text-center bg-card rounded-xl border border-border">
                        <p className="text-muted-foreground">No payment history found.</p>
                    </div>
                ) : (
                    <PaymentHistoryList history={paymentHistory} />
                )}
>>>>>>> Stashed changes
            </main>
        </div>
    );
}