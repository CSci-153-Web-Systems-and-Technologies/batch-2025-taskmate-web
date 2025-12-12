import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import Header from '@/components/header/page';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, MapPin, CheckCircle } from 'lucide-react';

interface ProfilePageProps {
    params: {
        username: string;
    };
}

interface ProviderProfile {
    id: string;
    fullname: string;
    username: string;
    expertTitle: string;
    rating: number;
    reviewsCount: number;
    location: string;
    description: string;
    specialization: string[];
    jobsCompleted: number;
    averageTime: string; 
    services: { title: string; price: number; time: string; description: string }[];
    availability: { day: string; hours: string }[];
    avatarUrl: string;
}

const formatCurrency = (amount: number) => `₱${amount.toFixed(0)}/hour`;

async function fetchProviderProfile(username: string): Promise<ProviderProfile | null> {
    const supabase = await getServerSupabase();
    
    const { data: profileData, error } = await supabase
        .from('profiles')
        .select(`
            id, full_name, username, rating, location, description, 
            services:services (title, description, price)
        `)
        .eq('username', username)
        .single();
    
    if (error || !profileData) {
        console.error("Error fetching provider profile:", error ? error.message : "Profile not found.");
        return null;
    }

    const services = profileData.services.map(svc => ({
        title: svc.title,
        price: svc.price,
        description: svc.description,
        time: '2-3 hours',
    }));

    return {
        id: profileData.id,
        fullname: profileData.full_name || profileData.username,
        username: profileData.username,
        
        expertTitle: "Professional Service Provider",
        rating: profileData.rating || 0,
        reviewsCount: 0,
        location: profileData.location || 'Unknown Location',
        description: profileData.description || "Experienced in various home services.",
        specialization: ["General Services", "Repairs"],
        jobsCompleted: 0,
        averageTime: "1-2 days",
        availability: [{ day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' }],
        avatarUrl: '/default-avatar.png',
        
        services: services,
    } as ProviderProfile;
}


export default async function ProviderProfilePage({ params }: ProfilePageProps) {
    const provider = await fetchProviderProfile(params.username); 

    if (!provider) {
        return (
            <div className="min-h-screen bg-background text-foreground text-center pt-20">
                <Header />
                <h1 className="text-3xl font-bold mt-10">Profile Not Found</h1>
                <p className="text-muted-foreground mt-4">The provider @{params.username} does not exist or has not completed setup.</p>
                <Link href="/browse" className="mt-8 inline-flex items-center text-primary hover:underline">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Return to Browse
                </Link>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                
                <div className="mb-6">
                    <Link href="/browse" className="inline-flex items-center text-primary hover:text-primary/80">
                        <ArrowLeft className="h-5 w-5 mr-2" /> Back
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-8">
                        
                        <div className="flex space-x-6 border-b border-border pb-6 items-start">
                            <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-green-500">
                                <Image src={provider.avatarUrl} alt={provider.fullname} layout="fill" objectFit="cover" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{provider.fullname}</h1>
                                <p className="text-md text-muted-foreground mb-1">{provider.expertTitle}</p>
                                
                                <div className="flex items-center space-x-2 text-sm text-yellow-600 mb-2">
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    <span>{provider.rating.toFixed(1)} ({provider.reviewsCount} reviews)</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-1"/>
                                    <span>{provider.location}</span>
                                </div>

                                <div className="mt-3 flex space-x-4 text-sm">
                                    <div className="text-green-500 font-semibold">
                                        {provider.jobsCompleted}% Jobs Completed
                                    </div>
                                    <div className="text-red-500 font-semibold">
                                        {provider.averageTime} Avg. Response Time
                                    </div>
                                </div>
                                
                                <div className="mt-4 space-x-4">
                                    <button className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-semibold">Contact Now</button>
                                    <button className="px-4 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Book Service</button>
                                </div>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 border-b border-border pb-2">Description</h2>
                            <p className="text-muted-foreground mb-4">{provider.description}</p>
                            
                            <h3 className="text-lg font-medium mb-2">Specialization</h3>
                            <ul className="list-disc list-inside text-muted-foreground ml-4">
                                {provider.specialization.map((spec, i) => <li key={i}>{spec}</li>)}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Service and Pricing</h2>
                            <div className="space-y-4">
                                {provider.services.map((service, i) => (
                                    <div key={i} className="p-4 border border-border rounded-lg flex justify-between items-center bg-card">
                                        <div>
                                            <h3 className="font-medium text-foreground">{service.title}</h3>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-primary">{formatCurrency(service.price)}</div>
                                            <div className="text-sm text-muted-foreground">{service.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Recent Reviews</h2>
                            <p className="text-muted-foreground">Reviews section to be implemented...</p>
                        </section>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="p-6 border border-border rounded-xl shadow-lg bg-card sticky top-8">
                            <h2 className="text-xl font-semibold mb-4">Quick Booking</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Service Type" className="w-full p-3 border border-border rounded-lg bg-input" />
                                <input type="text" placeholder="Preferred Date" className="w-full p-3 border border-border rounded-lg bg-input" />
                                <input type="text" placeholder="Estimated Hours" className="w-full p-3 border border-border rounded-lg bg-input" />
                            </div>
                            <button className="w-full mt-6 py-3 bg-foreground text-background rounded-lg font-semibold">Book Now</button>
                        </div>
                        
                        <section className="p-6 border border-border rounded-xl shadow-lg bg-card">
                            <h2 className="text-xl font-semibold mb-4">Availability</h2>
                            <div className="space-y-3 text-sm">
                                {provider.availability.map((item, i) => (
                                    <div key={i} className="flex justify-between border-b border-border/50 pb-2 last:border-b-0">
                                        <span className="font-medium text-foreground">{item.day}</span>
                                        <span className="text-muted-foreground">{item.hours}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center text-sm text-green-600 mt-4">
                                <CheckCircle className="h-4 w-4 mr-2 fill-green-500 text-white"/>
                                <span>Available Today</span>
                            </div>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}