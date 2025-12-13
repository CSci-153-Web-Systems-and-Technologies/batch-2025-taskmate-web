import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

interface ServiceListing {
    id: string;
    title: string;
    description: string;
    price: number;
    providerName: string;
    providerLocation: string;
    providerRating: number;
}

interface CategoryPageProps {
    params: {
        id: string;
    };
}

async function fetchServicesByCategory(categoryId: number): Promise<{ categoryName: string, services: ServiceListing[] }> {
    const supabase = await getServerSupabase();
    
    const { data: rawServices, error } = await supabase
        .from('services')
        .select(`
            id, title, description, price, 
            provider:profiles!fk_provider (fullname, location, rating),
            category:categories!fk_category (name)
        `)
        .eq('category_id', categoryId)
        .eq('is_published', true);

    if (error) {
        console.error("Error fetching services:", error);
        return { categoryName: 'Service Category', services: [] };
    }

    const categoryName = rawServices?.[0]?.category?.name || 'Service Category';

    const services: ServiceListing[] = rawServices.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        price: s.price,
        providerName: s.provider?.fullname || 'Unknown Provider',
        providerLocation: s.provider?.location || 'N/A',
        providerRating: s.provider?.rating || 0,
    }));

    return { categoryName, services };
}


export default async function CategoryPage({ params }: CategoryPageProps) {
    const categoryId = parseInt(params.id);
    const { categoryName, services } = await fetchServicesByCategory(categoryId);
    
    return (
        <div className="min-h-screen bg-muted p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-foreground mb-2">{categoryName}</h1>
                <p className="text-lg text-muted-foreground mb-10">
                    Showing {services.length} services available near you.
                </p>

                <div className="space-y-6">
                    {services.length === 0 ? (
                        <div className="text-center p-10 bg-card rounded-xl">
                            <p className="text-xl text-muted-foreground">No providers are currently offering services in this category.</p>
                        </div>
                    ) : (
                        services.map(service => (
                            <Link 
                                key={service.id} 
                                href={`/service/${service.id}`} 
                                className="block bg-card p-6 rounded-xl shadow-lg border border-border hover:border-primary transition"
                            >
                                <h2 className="text-2xl font-semibold text-foreground">{service.title}</h2>
                                <p className="text-sm text-muted-foreground mt-1 mb-3">{service.description}</p>
                                
                                <div className="flex items-center justify-between mt-4 border-t border-border pt-3">
                                    <div className="text-sm">
                                        <p className="font-medium text-primary">{service.providerName}</p>
                                        <div className="flex items-center text-muted-foreground">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            <span>{service.providerLocation}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-green-600">₱{service.price.toLocaleString()}</span>
                                        <span className="text-sm text-muted-foreground block">Base Price</span>
                                        <div className="flex items-center justify-end text-yellow-500">
                                            <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                                            <span>{service.providerRating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}