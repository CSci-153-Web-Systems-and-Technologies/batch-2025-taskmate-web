import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import DashboardSidebar from '../components/sidebar/page';
import PaymentHistoryList from '../components/payment-history-list/page';

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
}

export default async function PaymentHistoryPage() {
    const paymentHistory = await fetchPaymentHistory();

    return (
        <div className="min-h-screen bg-muted flex">
            <DashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Payment History</h1>
                <p className="text-muted-foreground mb-8">View a complete list of all your past transactions and payments.</p>

                <PaymentHistoryList history={paymentHistory} />
            </main>
        </div>
    );
}