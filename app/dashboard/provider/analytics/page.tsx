import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import ProviderDashboardSidebar from '../../_components/providerSidebar'; 
import { TrendingUp, MessageCircle, Clock, DollarSign } from 'lucide-react';

interface AnalyticsData {
    completionRate: number;
    customerSatisfaction: number;
    responseTime: string; 
    
    currentMonthEarning: number;
    lastMonthEarning: number;
    totalEarnings: number;
    growthRate: number; 
}

async function fetchProviderAnalytics(): Promise<AnalyticsData> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            completionRate: 0, customerSatisfaction: 0, responseTime: 'N/A',
            currentMonthEarning: 0, lastMonthEarning: 0, totalEarnings: 0, growthRate: 0,
        };
    }

    const { data: bookingData } = await supabase
        .from('bookings')
        .select('status, created_at')
        .eq('provider_id', user.id);

    const { data: transactionData } = await supabase
        .from('transactions')
        .select('payout_net, transaction_date')
        .eq('provider_id', user.id);

    const bookings = bookingData || [];
    const transactions = transactionData || [];

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;
    
    const calculatedCompletionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;
    
    const currentMonth = new Date().getMonth();
    const currentMonthEarnings = transactions
        .filter(t => new Date(t.transaction_date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + t.payout_net, 0);

    const totalEarnings = transactions.reduce((sum, t) => sum + t.payout_net, 0);

    return {
        completionRate: calculatedCompletionRate,
        customerSatisfaction: 4.8,
        responseTime: '< 2 Hours',
        
        currentMonthEarning: currentMonthEarnings,
        lastMonthEarning: 0,
        totalEarnings: totalEarnings,
        growthRate: 0, 
    };
}


const ProgressBar: React.FC<{ label: string, value: string | number, percentage: number }> = ({ label, value, percentage }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center text-sm font-medium">
            <span>{label}</span>
            <span>{value}{typeof value === 'number' && label.includes('Rate') ? '%' : ''}</span>
        </div>
        <div className="h-2 bg-muted-foreground/30 rounded-full">
            <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

const EarningsItem: React.FC<{ label: string, amount: number, isGrowth?: boolean }> = ({ label, amount, isGrowth = false }) => (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${isGrowth ? (amount > 0 ? 'text-green-500' : 'text-red-500') : 'text-foreground'}`}>
            {isGrowth ? `${amount > 0 ? '+' : ''}${(amount * 100).toFixed(0)}%` : `₱${amount.toLocaleString()}`}
        </span>
    </div>
);


export default async function ProviderAnalyticsPage() {
    const data = await fetchProviderAnalytics();
    
    const growthDisplay = data.growthRate * 100;

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
                <p className="text-muted-foreground mb-8">Track your performance and earning.</p>

                <div className="bg-card p-6 rounded-xl shadow-lg border border-border mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-primary" /> Monthly Performance</h2>
                    <div className="space-y-4">
                        <ProgressBar 
                            label="Completion Rate" 
                            value={data.completionRate} 
                            percentage={data.completionRate} 
                        />
                        <ProgressBar 
                            label="Customer Satisfaction" 
                            value={`${data.customerSatisfaction.toFixed(1)}/5.0`}
                            percentage={(data.customerSatisfaction / 5) * 100}
                        />
                        <ProgressBar 
                            label="Response Time" 
                            value={data.responseTime}
                            percentage={90} 
                        />
                    </div>
                </div>


                <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-green-500" /> Earnings Overview</h2>
                    <div className="space-y-2">
                        <EarningsItem label="This Month" amount={data.currentMonthEarning} />
                        <EarningsItem label="Last Month" amount={data.lastMonthEarning} />
                        <EarningsItem label="Total Earnings" amount={data.totalEarnings} />
                        <EarningsItem label="Growth Rate" amount={data.growthRate} isGrowth={true} />
                    </div>
                </div>
            </main>
        </div>
    );
}