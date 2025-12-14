"use client";
import React, { useState } from 'react';
import { MessageSquare, Check, X, Ban, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateBookingStatus } from '@/app/dashboard/actions';

interface Booking {
    id: string;
    customerName: string;
    serviceTitle: string;
    date: string;
    time: string;
    status: string;
    amount: number;
}

interface ProviderBooking extends Booking {
    actionButtons?: boolean;
}

interface RecentBookingsProps {
    bookings: (Booking | ProviderBooking)[]; 
    isProviderView?: boolean; 
}

const getStatusClasses = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
        case 'confirmed': case 'accepted': return 'bg-green-100 text-green-700 border-green-300';
        case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'in progress': return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'completed': return 'bg-gray-100 text-gray-700 border-gray-300';
        case 'rejected': case 'cancelled': return 'bg-red-100 text-red-700 border-red-300';
        default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

export default function RecentBookings({ bookings, isProviderView = false }: RecentBookingsProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAction = async (bookingId: string, action: 'Confirmed' | 'Rejected' | 'Cancelled') => {
        if (!confirm(`Are you sure you want to ${action} this booking?`)) return;

        setLoadingId(bookingId);
        try {
            // Call the Server Action
            await updateBookingStatus(bookingId, action);
            
            // Refresh UI
            router.refresh(); 
        } catch (error) {
            console.error(error);
            alert("Failed to update booking. Please try again.");
        } finally {
            setLoadingId(null);
        }
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
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <Headers />
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {(bookings || []).map((booking) => {
                            const statusLower = booking.status.toLowerCase();
                            const isPending = statusLower === 'pending';
                            
                            const showProviderActions = isProviderView && isPending;
                            
                            const showCancelAction = !isProviderView && isPending;

                            const isProcessing = loadingId === booking.id;

                            return (
                                <tr key={booking.id} className={isProcessing ? "opacity-50" : ""}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{booking.id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {booking.customerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.serviceTitle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.date} at {booking.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize ${getStatusClasses(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-foreground">
                                        ₱{booking.amount.toLocaleString()}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {isProcessing ? (
                                            <div className="flex justify-end">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            </div>
                                        ) : showProviderActions ? (
                                            <div className="flex space-x-2 justify-end">
                                                <button 
                                                    onClick={() => handleAction(booking.id, 'Confirmed')}
                                                    className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                                                    title="Accept Booking"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(booking.id, 'Rejected')}
                                                    className="p-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500/10 transition"
                                                    title="Reject Booking"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : showCancelAction ? (
                                            <button 
                                                onClick={() => handleAction(booking.id, 'Cancelled')}
                                                className="text-red-500 hover:text-red-700 flex items-center justify-end ml-auto transition font-medium"
                                            >
                                                <Ban className="h-4 w-4 mr-1"/> 
                                                Cancel
                                            </button>
                                        ) : (
                                            <span className="text-muted-foreground text-xs italic">
                                                {statusLower === 'completed' ? 'Completed' : 'No actions'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {(bookings || []).length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                        No recent bookings found.
                    </div>
                )}
            </div>
        </section>
    );
}