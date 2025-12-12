// app/dashboard/components/RecentBookings.tsx
import React from 'react';
import Image from 'next/image';

interface Booking {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed';
    amount: number;
}

interface RecentBookingsProps {
    bookings: Booking[];
}

// Utility to determine status styling
const getStatusClasses = (status: Booking['status']) => {
    switch (status) {
        case 'Confirmed': return 'bg-green-100 text-green-700 border-green-300';
        case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-300';
        default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

export default function RecentBookings({ bookings }: RecentBookingsProps) {
    return (
        <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
                Recent Bookings
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
                Your latest booking requests and appointments
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Booking ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date and Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{booking.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                                    {/* Placeholder Avatar */}
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                                        {/* Image component for customer avatar goes here */}
                                    </div>
                                    {booking.customerName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.serviceTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.date} at {booking.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-foreground">
                                    ₱{booking.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-primary hover:text-primary/80">Message</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}