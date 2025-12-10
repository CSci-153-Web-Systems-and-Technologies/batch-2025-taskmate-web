<<<<<<< HEAD
<<<<<<< Updated upstream
import Image from "next/image";
=======
import React from 'react';
import Header from '@/components/header/page';
import PersonSection from '@/components/person-section/page';
import ActionCards from '@/components/action-cards/page';
import CategorySection from '@/components/category-section/page';
>>>>>>> origin/feature/landing-page

const mockCategories = [
  { id: 1, name: 'Tutoring Services', snippet: 'Exam preparation, homework help, and skill-based learning.' },
  { id: 2, name: 'Cleaning Services', snippet: 'Deep cleaning, routine maintenance, and commercial services.' },
  { id: 3, name: 'Tech Services', snippet: 'Computer repair, software installation, and network setup.' },
  { id: 4, name: 'Handyman Services', snippet: 'Minor home repairs, assembly, and general maintenance.' },
  { id: 5, name: 'Photography Services', snippet: 'Event photography, drone filming, and product visuals.' },
  { id: 6, name: 'Automotive Services', snippet: 'Car repair, detailing, and tire services.' },
  { id: 7, name: 'Designing Services', snippet: 'Graphic design, logo creation, and web layouts.' },
];

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main className="container">
        <PersonSection />
        <ActionCards />
        <CategorySection categories={mockCategories} />
      </main>
      {/* A simple footer component would go here */}
    </div>
  );
}
<<<<<<< HEAD
=======
// app/page.tsx
// This file renders the main content at the root URL (/)

import { getServerSupabase } from '@/lib/supabase/server'; 
import React from 'react';
import Header from '@/components/header/page';
import PersonSection from '@/components/person-section/page';
import ActionCards from '@/components/action-cards/page';
import CategorySection from '@/components/category-section/page';

// ⚠️ TYPE CORRECTION: Standardize 'id' to string to match CategorySection interface
interface CategoryData {
    id: string; // Corrected from string | number
    name: string;
    snippet: string;
}

/**
 * Fetches featured categories from Supabase securely on the server.
 */
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

/**
 * The Main TaskMate Landing Page Component (Async Server Component)
 */
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
>>>>>>> Stashed changes
=======

export default LandingPage;
>>>>>>> origin/feature/landing-page
