<<<<<<< HEAD
// app/landing-page/page.tsx
// This file is now a simple redirect if the main content is at the root.

import { redirect } from 'next/navigation';

// This is a Server Component, so you use the Next.js redirect function.
export default function LandingPageRedirect() {
    // Redirects the user from /landing-page to /
    redirect('/');
}
=======
// LandingPage.js (or App.js)
import React from 'react';
import Header from '@/components/header/page.tsx';
import PersonSection from '@/components/person-section/page.tsx';
import ActionCards from '@/components/action-cards/page.tsx';
import CategorySection from '@/Components/category-section/page.tsx';

// Mock data to simulate fetching from your Supabase backend
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

export default LandingPage;
>>>>>>> origin/feature/landing-page
