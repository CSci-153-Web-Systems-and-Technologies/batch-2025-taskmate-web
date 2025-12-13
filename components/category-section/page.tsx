import React from 'react';
import Link from 'next/link';
import CategoryCard from '../category-card/page'; 

interface Category {
    id: string; 
    name: string;
<<<<<<< Updated upstream
    snippet: string;
=======
    is_featured: boolean;
>>>>>>> Stashed changes
}

export default function CategorySection({ categories }: { categories: Category[] }) {
    return (
        <section className="py-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Popular Categories
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
                Find exactly what you need from our diverse range of service categories, or discover new opportunities to offer your skills.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {categories.slice(0, 8).map((category) => (
                    <CategoryCard
                        key={category.id}
                        id={category.id}
                        name={category.name}
<<<<<<< Updated upstream
                        snippet={category.snippet}
=======
                        is_featured={category.is_featured}
>>>>>>> Stashed changes
                    />
                ))}
            </div>

            <div className="mt-12">
                <Link 
                    href="/categories" 
                    className="inline-flex items-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition"
                >
                    View More Categories →
                </Link>
            </div>
        </section>
    );
}