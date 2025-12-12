import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react'; 

interface CategoryCardProps {
    id: string;
    name: string;
    snippet: string;
}

export default function CategoryCard({ id, name, snippet }: CategoryCardProps) {
    const IconPlaceholder = name[0]; 

    const slug = name.toLowerCase().replace(/\s/g, '-'); 

    return (
        <div className="p-4 border border-border bg-card rounded-xl transition hover:shadow-lg">
            <div className="flex items-center mb-3">
                <span className="w-8 h-8 flex items-center justify-center text-lg font-bold bg-secondary text-secondary-foreground rounded-md mr-3">
                    {IconPlaceholder}
                </span>
                <h4 className="text-md font-semibold text-foreground">{name}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{snippet}</p>
            
            <Link 
                href={`/professionals/${slug}`} 
                className="flex items-center text-primary text-sm font-medium hover:underline"
            >
                Explore <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
        </div>
    );
}