import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import Header from '@/components/header'; 
import BookingForm from './bookingForm'; 

interface BookingPageProps {
    params: Promise<{
        id: string; 
    }>;
}

interface ServiceDetails {
    id: string;
    title: string;
    description: string;
    price: number;
}

interface ProviderDetails {
    id: string;
    fullname: string;
    username: string;
    location: string;
    avatarUrl: string;
    rating: number;
}

interface BookingData {
    service: ServiceDetails;
    provider: ProviderDetails;
}

async function fetchBookingData(serviceId: string): Promise<BookingData | null> {
    const supabase = await getServerSupabase();
    if (!supabase) return null;

    const { data: rawService, error: serviceError } = await supabase
        .from('services')
        .select('id, title, description, price, provider_id')
        .eq('id', serviceId)
        .single();

    if (serviceError || !rawService) return null;

    const { data: rawProvider, error: providerError } = await supabase
        .from('profiles')
        .select('id, fullname, username, location, avatar_url, rating')
        .eq('id', rawService.provider_id)
        .single();

    if (providerError || !rawProvider) return null;

    return {
        service: {
            id: rawService.id,
            title: rawService.title,
            description: rawService.description || "No description provided.",
            price: rawService.price || 500,
        },
        provider: {
            id: rawProvider.id,
            fullname: rawProvider.fullname || rawProvider.username || 'Unknown Provider',
            username: rawProvider.username || 'user',
            location: rawProvider.location || 'Remote',
            avatarUrl: rawProvider.avatar_url || '/default-avatar.png',
            rating: rawProvider.rating || 0,
        }
    };
}

export default async function BookingPage(props: BookingPageProps) {
    const params = await props.params;
    const serviceId = params.id;
    const data = await fetchBookingData(serviceId);

    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase!.auth.getUser();
    const isLoggedIn = !!user;

    if (!data) {
        return (
            <div className="min-h-screen bg-background pt-20 text-center">
                <Header />
                <h1 className="text-2xl font-bold mt-10">Service Not Found</h1>
                <Link href="/category" className="text-primary hover:underline mt-4 block">
                    <ArrowLeft className="inline w-4 h-4 mr-1" /> Return to Categories
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <Header />
            <main className="container mx-auto p-4 md:p-8 max-w-5xl">
                <div className="mb-6">
                    <Link href="/category" className="inline-flex items-center text-muted-foreground hover:text-primary transition">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Cancel & Go Back
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="bg-background border border-border p-8 rounded-xl shadow-sm">
                            <h1 className="text-3xl font-extrabold mb-3 text-foreground">{data.service.title}</h1>
                            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-6">
                                ₱{data.service.price}/hour
                            </div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</h3>
                            <p className="text-foreground/80 leading-relaxed">
                                {data.service.description}
                            </p>
                        </div>

                        <div className="bg-background border border-border p-6 rounded-xl flex items-center space-x-4 shadow-sm">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border shrink-0">
                                <Image src={data.provider.avatarUrl} alt={data.provider.fullname} fill className="object-cover" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Service Provided By</p>
                                <h3 className="font-bold text-lg">{data.provider.fullname}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3 mr-1" /> {data.provider.location}
                                    <span className="mx-2">•</span>
                                    <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" /> 
                                    {data.provider.rating.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <BookingForm 
                            serviceId={data.service.id}
                            providerId={data.provider.id} // ✅ Added this
                            serviceTitle={data.service.title} 
                            hourlyRate={data.service.price} 
                            providerName={data.provider.fullname}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}