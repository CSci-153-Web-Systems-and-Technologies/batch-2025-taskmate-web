// app/dashboard/provider/services/new/page.tsx
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import ProviderDashboardSidebar from '../../../components/provider-sidebar/page'; 
import AddServiceForm from './components/add-service-form'; // The main client component

interface Category {
    id: number;
    name: string;
}

async function fetchCategories(): Promise<Category[]> {
    const supabase = await getServerSupabase();
    
    const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    
    return data || [];
}

export default async function AddServicePage() {
    const categories = await fetchCategories();

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Add New Service</h1>
                <p className="text-muted-foreground mb-8">
                    Create a detailed listing for the new service you want to offer.
                </p>

                <AddServiceForm categories={categories} />
            </main>
        </div>
    );
}