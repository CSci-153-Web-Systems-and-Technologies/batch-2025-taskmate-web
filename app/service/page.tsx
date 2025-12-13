// app/service/[id]/page.tsx
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import { MapPin, Star, DollarSign, Clock } from 'lucide-react';
import BookingForm from './components/booking-form'; // Client component for booking action

interface ServiceDetail {
    id: string;
    title: string;
    description: string;
    price: number;
    providerId: string;
    providerName: string;
    providerLocation: string;
    providerRating: number;
}

interface ServicePageProps {
    params: {
        id: string;
    };
}

async function fetchServiceDetails(serviceId: string): Promise<ServiceDetail | null> {
    const supabase = await getServerSupabase();
    
    const { data: rawService, error } = await supabase
        .from('services')
        .select(`
            id, title, description, price, provider_id,
            provider:profiles!fk_provider (fullname, location, rating)
        `)
        .eq('id', serviceId)
        .eq('is_published', true)
        .single();

    if (error || !rawService) {
        console.error("Error fetching service details:", error);
        return null;
    }

    return {
        id: rawService.id,
        title: rawService.title,
        description: rawService.description,
        price: rawService.price,
        providerId: rawService.provider_id,
        providerName: rawService.provider?.fullname || 'Unknown Provider',
        providerLocation: rawService.provider?.location || 'N/A',
        providerRating: rawService.provider?.rating || 0,
    };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
    const service = await fetchServiceDetails(params.id);

    if (!service) {
        return <div className="min-h-screen p-10 text-center text-xl">Service not found or is unpublished.</div>;
    }

    return (
        <div className="min-h-screen bg-muted p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Service and Provider Details */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Service Header */}
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <h1 className="text-4xl font-bold text-foreground mb-2">{service.title}</h1>
                        <p className="text-xl text-green-600 font-semibold mb-4">
                            <DollarSign className="inline w-5 h-5 mr-1" />
                            ₱{service.price.toLocaleString()} Base Rate
                        </p>
                        
                        <p className="text-muted-foreground">{service.description}</p>
                    </div>

                    {/* Provider Info Card */}
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Service by: {service.providerName}</h3>
                            <div className="flex items-center text-muted-foreground mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{service.providerLocation}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 mr-1 fill-yellow-500" />
                                <span className="text-xl font-bold">{service.providerRating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-muted-foreground block">Average Rating</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-card p-6 rounded-xl shadow-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4">Book This Service</h2>
                        <BookingForm 
                            serviceId={service.id} 
                            providerId={service.providerId}
                            price={service.price}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}