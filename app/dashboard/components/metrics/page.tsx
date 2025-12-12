"use client";
import React from 'react';
import { CalendarCheck, Clock, MessageSquare, DollarSign } from 'lucide-react';

interface DashboardMetricsData {
    activeBookings: number;
    completedBookings: number;
    messages: number;
    monetaryValue: number;
}

interface DashboardMetricsProps {
    metrics: DashboardMetricsData;
    isProvider?: boolean;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    isCurrency: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, isCurrency }) => (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-foreground">
                {isCurrency ? `₱${value.toLocaleString()}` : value}
            </h3>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon className="h-6 w-6" />
        </div>
    </div>
);

export default function DashboardMetrics({ metrics, isProvider = false }: DashboardMetricsProps) {
    
    const fourthCardTitle = isProvider ? "Current Income" : "Total Paid";
    
    const messageIconColor = metrics.messages > 0 ? "bg-purple-600" : "bg-purple-300";

    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <MetricCard 
                title="Active Bookings" 
                value={metrics.activeBookings} 
                icon={Clock} 
                color="bg-blue-500" 
                isCurrency={false}
            />
            <MetricCard 
                title="Completed" 
                value={metrics.completedBookings} 
                icon={CalendarCheck} 
                color="bg-green-500" 
                isCurrency={false}
            />
            <MetricCard 
                title="Messages" 
                value={metrics.messages} 
                icon={MessageSquare} 
                color={messageIconColor} 
                isCurrency={false}
            />
            <MetricCard 
                title={fourthCardTitle}
                value={metrics.monetaryValue}
                icon={DollarSign} 
                color="bg-red-500" 
                isCurrency={true}
            />
        </section>
    );
}