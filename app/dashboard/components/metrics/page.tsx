// app/dashboard/components/DashboardMetrics.tsx
import React from 'react';
import { CalendarCheck, Clock, MessageSquare, DollarSign } from 'lucide-react';

interface MetricsProps {
    metrics: {
        activeBookings: number;
        completedBookings: number;
        messages: number;
        paymentHistory: number; // This key contains the total amount spent
    };
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-foreground">
                {/* Check if the title is "Total Paid" and format as currency (₱) */}
                {title === 'Total Paid' ? `₱${value.toLocaleString()}` : value}
            </h3>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon className="h-6 w-6" />
        </div>
    </div>
);

export default function DashboardMetrics({ metrics }: MetricsProps) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <MetricCard 
                title="Active Bookings" 
                value={metrics.activeBookings} 
                icon={Clock} 
                color="bg-blue-500" 
            />
            <MetricCard 
                title="Completed" 
                value={metrics.completedBookings} 
                icon={CalendarCheck} 
                color="bg-green-500" 
            />
            <MetricCard 
                title="Messages" 
                value={metrics.messages} 
                icon={MessageSquare} 
                color="bg-purple-500" 
            />
            {/* RENAMED the title displayed to "Total Paid" */}
            <MetricCard 
                title="Total Paid" 
                value={metrics.paymentHistory} // Uses the paymentHistory value
                icon={DollarSign} 
                color="bg-red-500" 
            />
        </section>
    );
}