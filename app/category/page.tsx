import { getServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import Header from '@/components/header/page';
import CategoryCard from '@/components/category-card/page';
<<<<<<< Updated upstream
=======
import { LayoutGrid } from 'lucide-react';
>>>>>>> Stashed changes

interface CategoryData {
    id: string;
    name: string;
<<<<<<< Updated upstream
    snippet: string;
=======
    is_featured: boolean;
>>>>>>> Stashed changes
}

async function fetchAllCategories(): Promise<CategoryData[]> {
    const supabase = await getServerSupabase();
    
<<<<<<< Updated upstream
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, snippet') 
=======
    // We query the 'category' table (singular) as established in your previous code
    const { data, error } = await supabase
        .from('categories') 
        .select('id, name') 
>>>>>>> Stashed changes
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching all categories:', error);
        return [];
    }
<<<<<<< Updated upstream
    return data as CategoryData[];
}

export default async function AllCategoriesPage() {
=======
    
    return data as CategoryData[];
}

export default async function CategoryIndexPage() {
>>>>>>> Stashed changes
    const categories = await fetchAllCategories();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
<<<<<<< Updated upstream
            <main className="container mx-auto p-4 md:p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">All Categories</h1>
                <p className="text-muted-foreground mb-10">
                    Browse every service available or discover new skills to offer!
                </p>

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
=======
            
            <main className="container mx-auto p-4 md:p-8 text-center">
                <div className="max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold mb-4">All Categories</h1>
                    <p className="text-muted-foreground text-lg">
                        Browse our complete list of services. Find the right professional for your needs.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-xl border border-border mt-8">
                        <LayoutGrid className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Categories Found</h3>
                        <p className="text-muted-foreground">
                            Check back later for new service categories.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                id={category.id}
                                name={category.name}
                                is_featured={category.is_featured}
                            />
                        ))}
                    </div>
                )}
>>>>>>> Stashed changes
            </main>
        </div>
    );
}