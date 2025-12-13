<<<<<<< Updated upstream
import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, CheckCircle } from 'lucide-react';
import AuthStatus from '@/components/auth-status'; 

interface Category {
    id: number;
    name: string;
}

async function fetchFeaturedCategories(): Promise<Category[]> {
    const supabase = await getServerSupabase();
    if (!supabase) return []; 
    
    const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_featured', true) 
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching featured categories:", error);
        return [];
    }
    return data || [];
}

export default async function LandingPage() {
    const featuredCategories = await fetchFeaturedCategories();
    
    return (
        <div className="min-h-screen bg-background">
            {/* ✅ REUSABLE HEADER COMPONENT */}
            <Header />

            <main className="pt-16"> 
                {/* Hero Section */}
                <section className="bg-primary/5 py-24 text-center">
                    <div className="max-w-3xl mx-auto px-4">
                        <h1 className="text-5xl font-extrabold text-foreground mb-4 leading-tight">
                            Find Local Service Professionals for Any Task
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            From plumbing to house cleaning, get your job done by verified providers.
                        </p>
                        
                        <div className="bg-card p-2 rounded-xl shadow-xl flex items-center max-w-lg mx-auto border border-border">
                            <Search className="w-5 h-5 text-muted-foreground ml-3" />
                            <input
                                type="text"
                                placeholder="Search for a service or provider..."
                                className="flex-1 p-3 bg-transparent text-foreground focus:outline-none"
                            />
                            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                                Search
                            </button>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-20 bg-background">
                    <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Featured Service Categories</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto px-4">
                        {featuredCategories.length > 0 ? (
                            featuredCategories.map(category => (
                                <Link 
                                    key={category.id} 
                                    href={`/category/${category.id}`} 
                                    className="p-6 bg-card border border-border rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group"
                                >
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                                        <Search className="w-6 h-6" /> 
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                                    <p className="text-sm text-muted-foreground">Browse professionals</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center p-10 bg-muted rounded-xl">
                                <p className="text-muted-foreground">No featured categories found.</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/category" className="text-lg font-medium text-primary hover:underline">
                            View All Categories →
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-muted py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-10 text-foreground">Why Choose TaskMate?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-card rounded-xl shadow-md">
                                <Search className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
                                <p className="text-muted-foreground">Find the right service near you in minutes.</p>
                            </div>
                            <div className="p-6 bg-card rounded-xl shadow-md">
                                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                                <p className="text-muted-foreground">Book with confidence with verified provider profiles.</p>
                            </div>
                            <div className="p-6 bg-card rounded-xl shadow-md">
                                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-xl font-semibold mb-2">Local Focus</h3>
                                <p className="text-muted-foreground">Support your community with local bookings.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-foreground py-8 text-center text-background">
                <p>&copy; {new Date().getFullYear()} TaskMate. All rights reserved.</p>
            </footer>
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
>>>>>>> Stashed changes
}

async function fetchFeaturedCategories(): Promise<Category[]> {
    const supabase = await getServerSupabase();
    if (!supabase) return []; 
    
    const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_featured', true) 
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching featured categories:", error);
        return [];
    }
    return data || [];
}

export default async function LandingPage() {
    const featuredCategories = await fetchFeaturedCategories();
    
    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Image src="/taskmate-logo.svg" alt="TaskMate Logo Icon" width={30} height={30} priority/>
                        <span className="text-2xl font-bold text-foreground">
                            <span className="text-green-500">Task</span>Mate
                        </span>
                    </div>
                    
                    <AuthStatus /> 

                </div>
            </header>

            <main className="pt-16"> 
                <section className="bg-primary/5 py-24 text-center">
                    <div className="max-w-3xl mx-auto px-4">
                        <h1 className="text-5xl font-extrabold text-foreground mb-4 leading-tight">
                            Find Local Service Professionals for Any Task
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            From plumbing to house cleaning, get your job done by verified providers.
                        </p>
                        
                        <div className="bg-card p-2 rounded-xl shadow-xl flex items-center max-w-lg mx-auto border border-border">
                            <Search className="w-5 h-5 text-muted-foreground ml-3" />
                            <input
                                type="text"
                                placeholder="Search for a service or provider..."
                                className="flex-1 p-3 bg-transparent text-foreground focus:outline-none"
                            />
                            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                                Search
                            </button>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Featured Service Categories</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 container mx-auto px-4">
                        {featuredCategories.length > 0 ? (
                            featuredCategories.map(category => (
                                <Link 
                                    key={category.id} 
                                    href={`/category/${category.id}`} 
                                    className="p-6 bg-card border border-border rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group"
                                >
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                                        <Search className="w-6 h-6" /> 
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                                    <p className="text-sm text-muted-foreground">Browse professionals</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center p-10 bg-muted rounded-xl">
                                <p className="text-muted-foreground">No featured categories found. Please check your Supabase data.</p>
                            </div>
                        )}
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/categories" className="text-lg font-medium text-primary hover:underline">
                            View All Categories →
                        </Link>
                    </div>
                </section>

                <section className="bg-muted py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-10 text-foreground">Why Choose TaskMate?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-card rounded-xl shadow-md">
                                <Search className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
                                <p className="text-muted-foreground">Find the right service near you in minutes.</p>
                            </div>
                            <div className="p-6 bg-card rounded-xl shadow-md">
                                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                                <p className="text-muted-foreground">Book with confidence with verified provider profiles.</p>
                            </div>
                            <div className="p-6 bg-card rounded-xl shadow-md">
                                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                                <h3 className="text-xl font-semibold mb-2">Local Focus</h3>
                                <p className="text-muted-foreground">Support your community with local bookings.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-foreground py-8 text-center text-background">
                <p>&copy; {new Date().getFullYear()} TaskMate. All rights reserved.</p>
            </footer>
        </div>
    );
}