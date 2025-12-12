// app/dashboard/saved/components/SavedProvidersList.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ProviderData {
    id: string;
    fullName: string;
    expertTitle: string;
    rating: number;
    hourlyRate: number;
    availability: 'Available' | 'Busy';
    username: string; 
}

interface SavedProvidersListProps {
    providers: ProviderData[];
}

const formatCurrency = (amount: number) => `₱${amount.toFixed(0)}/hour`;

const ProviderCard: React.FC<{ provider: ProviderData }> = ({ provider }) => {
    return (
        <div className="bg-card p-6 rounded-xl shadow-md border border-border flex items-center justify-between transition hover:shadow-lg">
            
            {/* Left Section: Profile Info */}
            <div className="flex items-center space-x-4">
                {/* Avatar Placeholder */}
                <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
                    {/* Placeholder image here */}
                </div>
                
                <div>
                    <Link href={`/profile/${provider.username}`} className="text-lg font-semibold text-foreground hover:text-primary transition">
                        {provider.fullName}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-1">{provider.expertTitle}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                        {/* Rating */}
                        <div className="flex items-center text-yellow-600">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                            <span>{provider.rating.toFixed(1)}</span>
                        </div>
                        {/* Rate */}
                        <span className="font-medium text-foreground">{formatCurrency(provider.hourlyRate)}</span>
                        {/* Availability */}
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            provider.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {provider.availability}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex space-x-3 text-sm font-semibold">
                <button className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition">
                    Message
                </button>
                <button className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition">
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default function SavedProvidersList({ providers }: SavedProvidersListProps) {
    if (providers.length === 0) {
        return (
            <div className="text-center p-10 bg-card rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-2">No Saved Providers</h2>
                <p className="text-muted-foreground">Start exploring categories to save your favorite service providers!</p>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            {providers.map(provider => (
                <ProviderCard key={provider.id} provider={provider} />
            ))}
        </section>
    );
}