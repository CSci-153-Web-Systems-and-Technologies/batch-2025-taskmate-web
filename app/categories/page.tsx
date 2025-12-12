// app/categories/page.tsx
import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import Header from '@/components/header/page';
import CategoryCard from '@/components/category-card/page'; // Direct import of the card

// Define the type (ensuring 'id' is string, as corrected)
interface CategoryData {
    id: string;
    name: string;
    snippet: string;
}

/**
 * Fetches ALL categories from Supabase.
 */
async function fetchAllCategories(): Promise<CategoryData[]> {
    const supabase = await getServerSupabase();
    
    // Remove .eq('is_featured', true) to fetch ALL categories
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, snippet') 
        .order('name', { ascending: true }); // Order alphabetically for a browsable list

    if (error) {
        console.error('Error fetching all categories:', error);
        return [];
    }
    return data as CategoryData[];
}

export default async function AllCategoriesPage() {
    const categories = await fetchAllCategories();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto p-4 md:p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">All Categories</h1>
                <p className="text-muted-foreground mb-10">
                    Browse every service available or discover new skills to offer!
                </p>

                {/* Uses the same grid as CategorySection, but renders all */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {categories.map((category) => (
                        <CategoryCard
                            id={category.id}
                            key={category.id}
                            name={category.name}
                            snippet={category.snippet}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}