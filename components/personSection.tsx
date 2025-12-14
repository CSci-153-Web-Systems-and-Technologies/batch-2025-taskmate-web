"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function PersonSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <section className="text-center py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
        Find Services or Offer Your Skills
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Connect with trusted professionals for any task, or start earning by offering your expertise to thousands of customers.
      </p>
      
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="flex items-center bg-card border border-border rounded-xl shadow-md p-1">
          <Search className="h-5 w-5 text-muted-foreground ml-3" />
          <input
            type="text"
            placeholder="What services would you like to use?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-3 bg-transparent focus:outline-none placeholder:text-muted-foreground"
          />
          <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition">
            Search
          </button>
        </div>
      </form>
    </section>
  );
}