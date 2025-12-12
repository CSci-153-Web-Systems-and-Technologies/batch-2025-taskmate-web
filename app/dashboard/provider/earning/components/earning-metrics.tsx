// app/dashboard/provider/earning/components/EarningMetrics.tsx
import React from 'react';
import { TrendingUp, FileText, Clock, DollarSign } from 'lucide-react';

interface EarningData {
    totalEarning: number;
    pendingEarning: number;
    commissionRate: number;
}

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border flex flex-col justify-between">
        <div className={`p-2 rounded-full w-fit mb-3 ${color} text-white`}>
            <Icon className="h-6 w-6" />
        </div>
        <div className="flex justify-between items-end">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>
    </div>
);

export default function EarningMetrics({ data }: { data: EarningData }) {
    const formatCurrency = (amount: number) => `₱${amount.toLocaleString()}`;

    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            
            {/* 1. Total Earning */}
            <MetricCard 
                title="Total Earning" 
                value={formatCurrency(data.totalEarning)}
                icon={DollarSign} 
                color="bg-green-500" 
            />

            {/* 2. Pending Earning */}
            <MetricCard 
                title="Pending Earning" 
                value={formatCurrency(data.pendingEarning)}
                icon={Clock} 
                color="bg-yellow-500" 
            />

            {/* 3. Commission Rate */}
            <MetricCard 
                title="Commission" 
                value={`${(data.commissionRate * 100).toFixed(0)}%`}
                icon={FileText} 
                color="bg-purple-500" 
            />
            
            {/* 4. Total Completed Bookings (Mocked based on common metrics) */}
            <MetricCard 
                title="Completed Bookings" 
                value="45" // Placeholder value
                icon={TrendingUp} 
                color="bg-blue-500" 
            />
        </section>
    );
}