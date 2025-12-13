import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
<<<<<<< Updated upstream
import ProviderDashboardSidebar from '@/app/dashboard/components/provider-sidebar/page';
=======
import ProviderDashboardSidebar from '@/app/dashboard/components/provider-sidebar';
>>>>>>> Stashed changes
import Link from 'next/link';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

interface Service {
    id: string;
    title: string;
    category: string;
    price: number;
    description: string;
    isPublished: boolean;
}

async function fetchProviderServices(): Promise<Service[]> {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: serviceData, error } = await supabase
        .from('services')
        .select(`
            id, title, price, description, is_published,
            category:categories (name) 
        `)
        .eq('provider_id', user.id);

    if (error) {
        console.error("Error fetching services:", error);
        return [];
    }

<<<<<<< Updated upstream
    return serviceData.map(s => ({
        id: s.id,
        title: s.title,
        category: s.category?.name || 'N/A',
        price: s.price,
        description: s.description,
        isPublished: s.is_published,
    })) as Service[];
=======
    return serviceData.map(s => {
        // 🛠️ FIX: Handle 'category' safely (it might be an array or an object)
        const cat = s.category as any;
        const categoryName = Array.isArray(cat) ? cat[0]?.name : cat?.name;

        return {
            id: s.id,
            title: s.title,
            category: categoryName || 'N/A',
            price: s.price,
            description: s.description,
            isPublished: s.is_published,
        };
    }) as Service[];
>>>>>>> Stashed changes
}

const formatCurrency = (amount: number) => `₱${amount.toFixed(0)}/hr`;

export default async function MyServicesPage() {
    const services = await fetchProviderServices();

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">My Services</h1>
                    <Link 
                        href="/dashboard/provider/services/new" 
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                    >
                        <PlusCircle className="h-5 w-5 mr-2" /> New Service
                    </Link>
                </div>
                <p className="text-muted-foreground mb-8">
                    View, edit, and manage the services you offer to customers.
                </p>

                <div className="space-y-4">
                    {services.length === 0 ? (
                        <div className="text-center p-10 bg-card rounded-xl border border-border">
                            <p className="text-lg text-muted-foreground">You are not offering any services yet.</p>
                        </div>
                    ) : (
                        services.map(service => (
                            <div key={service.id} className="bg-card p-5 rounded-xl shadow-md border border-border flex justify-between items-center">
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground">{service.title}</h2>
                                    <p className="text-sm text-muted-foreground">Category: {service.category} | {formatCurrency(service.price)}</p>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                                        service.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {service.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                <div className="flex space-x-3">
                                    <Link href={`/dashboard/provider/services/${service.id}`} className="p-2 text-primary hover:text-primary/80 transition rounded-full hover:bg-muted">
                                        <Edit2 className="h-5 w-5" />
                                    </Link>
                                    <button className="p-2 text-red-500 hover:text-red-700 transition rounded-full hover:bg-muted">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}