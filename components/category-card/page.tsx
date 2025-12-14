import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

interface CategoryCardProps {
    id: string;
    name: string;
    is_featured: boolean;
}

export default function CategoryCard({ id, name, is_featured }: CategoryCardProps) {
    const IconPlaceholder = name.charAt(0); 

    const hrefLink = `/category/${id}`;

    return (
        <div className="p-4 border border-border bg-card rounded-xl transition hover:shadow-lg hover:border-primary/50 relative">
            
            {is_featured && (
                <div className="absolute top-0 right-0 m-2 flex items-center bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    Featured
                </div>
            )}
            
            <div className="flex items-center mb-3">
                <span className="w-10 h-10 flex items-center justify-center text-lg font-bold bg-secondary text-secondary-foreground rounded-full mr-3 shadow-sm">
                    {IconPlaceholder}
                </span>
                
                <h4 className="text-lg font-semibold text-foreground">{name}</h4>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 min-h-6">
                View services in this category.
            </p>
            
            <Link 
                href={hrefLink} 
                className="flex items-center text-primary text-sm font-medium hover:underline group-hover:text-primary-foreground transition duration-150"
            >
                Explore Services <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Link>
        </div>
    );
}