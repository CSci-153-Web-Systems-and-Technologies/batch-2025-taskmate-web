"use client";
import React from 'react';
import Image from 'next/image';
import { MessageSquare, Check, X } from 'lucide-react';


interface Booking {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'In Progress' | 'Completed';
    amount: number;
}

interface ProviderBooking extends Booking {
    actionButtons: boolean;
}

interface RecentBookingsProps {
    bookings: (Booking | ProviderBooking)[];
    isProviderView?: boolean;
}


const getStatusClasses = (status: Booking['status']) => {
    switch (status) {
        case 'Confirmed': return 'bg-green-100 text-green-700 border-green-300';
        case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-300';
        default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};


export default function RecentBookings({ bookings, isProviderView = false }: RecentBookingsProps) {
    
    const handleAction = (bookingId: string, action: 'accept' | 'reject') => {
        console.log(`Provider action: ${action} for booking ID: ${bookingId}`);
        alert(`Booking ${bookingId} ${action}ed.`);
    };

    const Headers = () => (
        <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Booking ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {isProviderView ? 'Customer' : 'Provider'}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Service</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date and Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
        </tr>
    );


    return (
        <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
                {isProviderView ? 'Incoming Bookings' : 'Recent Bookings'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
                {isProviderView ? 'Review service requests from customers.' : 'Your latest booking requests and appointments.'}
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <Headers />
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {bookings.map((booking, i) => {
                            const providerBooking = booking as ProviderBooking;
                            const showActions = isProviderView && providerBooking.actionButtons;
                            
                            return (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
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
                                        {showActions ? (
                                            <div className="flex space-x-2 justify-end">
                                                <button 
                                                    onClick={() => handleAction(booking.id, 'accept')}
                                                    className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(booking.id, 'reject')}
                                                    className="p-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500/10 transition"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="text-primary hover:text-primary/80 flex items-center justify-end">
                                                <MessageSquare className="h-4 w-4 mr-1"/> 
                                                Message
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {bookings.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                        No bookings found.
                    </div>
                )}
            </div>
        </section>
    );
}