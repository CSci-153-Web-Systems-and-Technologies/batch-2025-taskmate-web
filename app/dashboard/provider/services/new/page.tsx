import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import ProviderDashboardSidebar from '../../../_components/providerSidebar'; 
import ServiceForm from './_components/addServiceForm'; 

async function fetchCategories() {
    const supabase = await getServerSupabase();
    const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
    return data || [];
}

export default async function NewServicePage() {
    const categories = await fetchCategories();

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Add New Service</h1>
                <p className="text-muted-foreground mb-8">
                    Create a detailed listing for the new service you want to offer.
                </p>

                <ServiceForm categories={categories} />
            </main>
        </div>
    );
}