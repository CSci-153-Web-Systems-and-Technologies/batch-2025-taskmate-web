// app/page.tsx

import { getServerSupabase } from '@/lib/supabase/server'; 
import React from 'react';
import Header from '@/components/header/page';
import PersonSection from '@/components/person-section/page';
import ActionCards from '@/components/action-cards/page';
import CategorySection from '@/components/category-section/page';
>>>>>>> origin/feature/landing-page

// ⚠️ TYPE FIX: Standardized 'id' to string
interface CategoryData {
    id: string; 
    name: string;
    snippet: string;
}

async function fetchCategories(): Promise<CategoryData[]> {
    const supabase = await getServerSupabase(); 

    const { data, error } = await supabase
        .from('categories')
        .select('id, name, snippet') 
        .eq('is_featured', true)
        .limit(7);

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    
    return data as CategoryData[];
}
<<<<<<< HEAD
=======
// app/page.tsx
// This file renders the main content at the root URL (/)

export default async function LandingPage() {
    const categories = await fetchCategories();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header /> 
            
            <main className="container mx-auto p-4 md:p-8">
                <PersonSection />
                <ActionCards />
                <CategorySection categories={categories} />
            </main>
        </div>
    );
}