// components/header/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/taskmate-logo.svg" 
          alt="TaskMate Logo Icon"
          width={30} 
          height={30} 
          priority
        />
        <span className="text-2xl font-bold text-foreground">
          <span className="text-green-500">Task</span>Mate
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <Link href="/">Home</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/browse">Browse</Link>
      </nav>

      {/* Auth Buttons */}
      <div className="space-x-4 flex items-center">
        <Link href="/auth" className="text-sm font-medium text-foreground hover:text-primary">
          Log In
        </Link>
        <Link href="/auth" className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
          Sign Up
        </Link>
      </div>
    </header>
  );
}