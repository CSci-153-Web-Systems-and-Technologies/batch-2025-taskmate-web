import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import Header from '@/components/header';

interface ServiceListing {
    id: string;
    title: string;
    description: string;
    price: number;
    providerName: string;
    providerLocation: string;
    providerRating: number;
    providerUsername: string;
}

interface CategoryPageProps {
    params: {
        id: string;
    };
}


async function fetchServicesByCategory(categoryId: number): Promise<{ categoryName: string; services: ServiceListing[] }> {
    const supabase = await getServerSupabase();


    const { data: rawServices, error } = await supabase
        .from('services')
        .select('id,title,description,price,provider_id')
        .eq('category_id', categoryId)
        .eq('is_published', true);

    if (error || !rawServices?.length) {
        return { categoryName: 'Service Category', services: [] };
    }

    const providerIds = rawServices.map(s => s.provider_id);

    const { data: providers, error: providerError } = await supabase
        .from('profiles')
        .select('id, fullname, location, rating, username')
        .in('id', providerIds)
        .eq('role', 'provider');

    if (providerError || !providers) {
        return { categoryName: 'Service Category', services: [] };
    }

    const providerMap = new Map(
        providers.map(p => [p.id, p])
    );

    const { data: category } = await supabase
        .from('category')
        .select('name')
        .eq('id', categoryId)
        .single();

    const categoryName = category?.name ?? 'Service Category';


    const services: ServiceListing[] = rawServices.map(s => {
        const provider = providerMap.get(s.provider_id);

        return {
            id: s.id,
            title: s.title,
            description: s.description,
            price: s.price,
            providerName: provider?.fullname ?? 'Unknown Provider',
            providerLocation: provider?.location ?? 'N/A',
            providerRating: provider?.rating ?? 0,
            providerUsername: provider?.username ?? 'user',
        };
    });

    return { categoryName, services };
}

export default async function CategoryPage(props: { params: Promise<{ id: string }> }) {
    const {id} = await props.params;
    const categoryId = parseInt(id);
    console.log("Category ID:", categoryId);
    const { categoryName, services } = await fetchServicesByCategory(categoryId);
    

    return (
        <div className="min-h-screen bg-muted"> 
            
            <Header /> 
            <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-foreground text-center mb-2">
                    {categoryName} Professionals
                </h1>
                <p className="text-xl text-muted-foreground text-center mb-12">
                    Find exactly what you need from our diverse range of service categories.
                </p>
                <div className="space-y-6">
                    {services.length === 0 ? (
                        <div className="text-center p-16 bg-card rounded-xl border border-border">
                            <p className="text-2xl text-muted-foreground">No providers are currently offering services in this category.</p>
                            <p className="text-sm text-muted-foreground mt-2">Try checking back later or browsing another category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {services.map(service => (
                                <Link 
                                    key={service.id} 
                                    href={`/book/${service.id}`} 
                                    className="block bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition duration-300"
                                >
                                    <h2 className="text-xl font-semibold text-foreground">{service.title}</h2>
                                    <p className="text-xs text-muted-foreground mt-1 mb-3">{service.description.substring(0, 100)}...</p>
                                    
                                    <div className="flex items-center justify-between mt-4 border-t border-border pt-3">
                                        <div className="text-sm">
                                            <p className="font-medium text-primary">{service.providerName}</p>
                                            <div className="flex items-center text-muted-foreground">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                <span>{service.providerLocation}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-green-600">₱{service.price.toLocaleString()}</span>
                                            <div className="flex items-center justify-end text-yellow-500">
                                                <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                                                <span>{service.providerRating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}