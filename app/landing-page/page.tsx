// app/landing-page/page.tsx
// This file is now a simple redirect if the main content is at the root.

import { redirect } from 'next/navigation';

// This is a Server Component, so you use the Next.js redirect function.
export default function LandingPageRedirect() {
    // Redirects the user from /landing-page to /
    redirect('/');
}