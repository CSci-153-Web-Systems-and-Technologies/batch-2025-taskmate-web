"use client";

import React, { useState } from 'react';
import { Minus, Plus, Loader2, CheckCircle, Lock, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBooking } from './actions';

interface BookingFormProps {
    serviceId: string;
    providerId: string;
    serviceTitle: string;
    hourlyRate: number;
    providerName: string;
    isLoggedIn: boolean;
}

export default function BookingForm({ serviceId, providerId, hourlyRate, providerName, isLoggedIn }: BookingFormProps) {
    const router = useRouter();
    const [hours, setHours] = useState(2);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const total = hours * hourlyRate;

    const handleIncrement = () => setHours(prev => Math.min(prev + 1, 12));
    const handleDecrement = () => setHours(prev => Math.max(prev - 1, 1));

    const handleHire = async () => {
        if (!isLoggedIn) {
            const nextUrl = encodeURIComponent(`/book/${serviceId}`);
            router.push(`/login?next=${nextUrl}`);
            return;
        }

        if (!date) {
            setError("Please select a date for the service.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createBooking(serviceId, providerId, hours, total, date);
            
            setLoading(false);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setLoading(false);
            const msg = err instanceof Error ? err.message : "Failed to create booking.";
            setError(msg);
        }
    };

    if (success) {
        return (
            <div className="bg-card border border-green-200 rounded-xl shadow-lg p-8 text-center sticky top-8 animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Booking Requested!</h2>
                <p className="text-muted-foreground">
                    Request sent to {providerName} for <br/> 
                    <span className="font-semibold text-foreground">{date}</span> ({hours} hrs).
                </p>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="font-semibold">Total: ₱{total.toLocaleString()}</p>
                </div>
                <button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="mt-6 w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-xl shadow-lg p-6 md:p-8 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Booking Details</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                    When do you need this?
                </label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input 
                        type="date" 
                        required
                        className="w-full pl-10 p-3 bg-muted/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary outline-none transition"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                    Duration (Hours)
                </label>
                <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2 border border-border">
                    <button 
                        onClick={handleDecrement}
                        className="p-3 bg-background rounded-md shadow-sm hover:bg-muted transition disabled:opacity-50"
                        disabled={hours <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold font-mono w-12 text-center text-foreground">{hours}</span>
                    <button 
                        onClick={handleIncrement}
                        className="p-3 bg-background rounded-md shadow-sm hover:bg-muted transition disabled:opacity-50"
                        disabled={hours >= 12}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-3 py-4 border-t border-b border-border mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-medium">₱{hourlyRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{hours} hrs</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-dashed border-border mt-2">
                    <span>Total Amount</span>
                    <span className="text-primary text-2xl">₱{total.toLocaleString()}</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <button 
                onClick={handleHire}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition flex items-center justify-center disabled:opacity-70
                    ${isLoggedIn 
                        ? 'bg-foreground text-background hover:opacity-90' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    }`}
            >
                {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : isLoggedIn ? (
                    <>Hire Now</>
                ) : (
                    <><Lock className="w-4 h-4 mr-2" /> Log in to Hire</>
                )}
            </button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
                You won't be charged until the provider accepts.
            </p>
        </div>
    );
}