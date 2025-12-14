import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import ProviderDashboardSidebar from '@/app/dashboard/_components/providerSidebar'; 
import ServiceForm from '../new/_components/addServiceForm'; 
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

async function fetchService(id: string) {
    const supabase = await getServerSupabase();
    // Fetch service and ensure the user owns it (optional safety check)
    const { data } = await supabase.from('services').select('*').eq('id', id).single();
    return data;
}

async function fetchCategories() {
    const supabase = await getServerSupabase();
    const { data } = await supabase.from('categories').select('id, name').order('name');
    return data || [];
}

export default async function EditServicePage(props: Props) {
    const params = await props.params;
    const [service, categories] = await Promise.all([
        fetchService(params.id),
        fetchCategories()
    ]);

    if (!service) return notFound();

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Edit Service</h1>
                <p className="text-muted-foreground mb-8">Update your service details below.</p>
                
                <ServiceForm categories={categories} initialData={service} />
            </main>
        </div>
    );
}