// components/category-card/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react'; // Example icon

interface CategoryCardProps {
  name: string;
  snippet: string;
}

export default function CategoryCard({ name, snippet }: CategoryCardProps) {
  // Determine a unique icon/initial based on the name for visual distinction
  const IconPlaceholder = name[0]; 

  return (
    <div className="p-4 border border-border bg-card rounded-xl transition hover:shadow-lg">
      <div className="flex items-center mb-3">
        {/* Placeholder Icon Styling */}
        <span className="w-8 h-8 flex items-center justify-center text-lg font-bold bg-secondary text-secondary-foreground rounded-md mr-3">
          {IconPlaceholder}
        </span>
        <h4 className="text-md font-semibold text-foreground">{name}</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{snippet}</p>
      <Link href={`/categories/${name.toLowerCase().replace(/\s/g, '-')}`} className="flex items-center text-primary text-sm font-medium hover:underline">
        Explore <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  );
}