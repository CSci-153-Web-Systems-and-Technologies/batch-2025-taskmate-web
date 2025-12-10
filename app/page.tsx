<<<<<<< Updated upstream
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
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
