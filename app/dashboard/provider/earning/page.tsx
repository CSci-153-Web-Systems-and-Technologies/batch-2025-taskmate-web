import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import ProviderDashboardSidebar from '../../components/provider-sidebar/page'; 
import EarningMetrics from './components/earning-metrics'; 
import EarningHistoryTable from './components/earning-history-table'; 

interface Transaction {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    amount: number;
    payoutAmount: number; 
    status: 'Paid' | 'Pending' | 'Canceled';
}

interface EarningData {
    totalEarning: number;
    pendingEarning: number;
    commissionRate: number;
    transactions: Transaction[];
}

async function fetchProviderEarning(): Promise<EarningData> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { totalEarning: 0, pendingEarning: 0, commissionRate: 0, transactions: [] };
    }

    const COMMISSION_RATE = 0.10;

    const { data: rawTransactions, error } = await supabase
        .from('transactions')
        .select(`
            id, amount_paid, payout_net, status, transaction_date,
            booking:bookings!fk_booking_id (service:services!fk_service_id (title)),
            customer:profiles!fk_customer_id (fullname)
        `)
        .eq('provider_id', user.id)
        .order('transaction_date', { ascending: false });

    if (error) {
        console.error("Error fetching transactions:", error);
        return { totalEarning: 0, pendingEarning: 0, commissionRate: 0, transactions: [] };
    }

    const transactions: Transaction[] = rawTransactions.map(t => ({
        id: t.id,
        customerName: t.customer?.fullname || 'Customer',
        serviceTitle: t.booking?.service?.title || 'Service Missing',
        date: new Date(t.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: t.amount_paid,
        payoutAmount: t.payout_net,
        status: t.status as Transaction['status'],
    }));

    const totalEarning = transactions
        .filter(t => t.status === 'Paid')
        .reduce((sum, t) => sum + t.payoutAmount, 0);

    const pendingEarning = transactions
        .filter(t => t.status === 'Pending')
        .reduce((sum, t) => sum + t.payoutAmount, 0);

    return {
        totalEarning: totalEarning,
        pendingEarning: pendingEarning,
        commissionRate: COMMISSION_RATE,
        transactions: transactions,
    };
}

export default async function ProviderEarningPage() {
    const earningData = await fetchProviderEarning();

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Earning Overview</h1>
                <p className="text-muted-foreground mb-8">Track your payments, commissions, and total earnings.</p>

                <EarningMetrics data={earningData} />

                <EarningHistoryTable transactions={earningData.transactions} />
            </main>
        </div>
    );
}