// app/service/[id]/components/BookingForm.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Calendar, Clock, DollarSign, Loader2, Check } from 'lucide-react';

interface BookingFormProps {
    serviceId: string;
    providerId: string;
    price: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ serviceId, providerId, price }) => {
    const router = useRouter();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        if (!date || !time) {
            setMessage({ type: 'error', text: 'Please select both a date and a time.' });
            return;
        }

        setLoading(true);

        // 1. Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setMessage({ type: 'error', text: 'You must log in to submit a booking.' });
            setLoading(false);
            // Optionally redirect to login page
            setTimeout(() => router.push('/auth/signin'), 2000);
            return;
        }

        // 2. Prepare the booking data
        const newBooking = {
            customer_id: user.id,
            provider_id: providerId,
            service_id: serviceId,
            status: 'Pending', // Initial status is always pending provider approval
            date: date,
            time: time,
            amount: price, // Use the base price of the service
        };

        // 3. Insert the booking into the 'bookings' table
        const { error } = await supabase
            .from('bookings')
            .insert([newBooking]);

        setLoading(false);

        if (error) {
            console.error("Supabase booking insert error:", error);
            setMessage({ type: 'error', text: `Failed to create booking: ${error.message}` });
        } else {
            setMessage({ type: 'success', text: 'Booking successfully submitted! Awaiting provider confirmation.' });
            
            // Redirect customer to their bookings dashboard after success
            setTimeout(() => {
                router.push('/dashboard/bookings');
            }, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-xl font-semibold text-foreground">Booking Details</h3>
            
            {/* Display Message */}
            {message && (
                <div className={`p-3 rounded-lg text-sm font-medium flex items-center ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.type === 'success' ? <Check className="w-4 h-4 mr-2" /> : <Loader2 className="w-4 h-4 mr-2" />}
                    {message.text}
                </div>
            )}

            {/* Price Display */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                <span className="text-base font-medium text-muted-foreground">Price</span>
                <span className="text-xl font-bold text-green-600 flex items-center">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {price.toLocaleString()}
                </span>
            </div>

            {/* Date Picker */}
            <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-1 block">Date</span>
                <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Prevents selecting past dates
                        className="w-full p-3 pl-10 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary appearance-none"
                        required
                    />
                </div>
            </label>

            {/* Time Picker */}
            <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-1 block">Time</span>
                <div className="relative">
                    <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full p-3 pl-10 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary appearance-none"
                        required
                    />
                </div>
            </label>
            
            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={loading} 
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        Book Now
                    </>
                )}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-2">
                Your booking is **Pending** until the provider confirms the time slot.
            </p>
        </form>
    );
};

export default BookingForm;