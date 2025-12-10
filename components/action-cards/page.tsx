// components/action-cards/page.tsx
import React from 'react';
import Link from 'next/link';

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, buttonText, href }) => (
  <div className="flex-1 p-8 border border-border bg-card rounded-2xl shadow-lg transition hover:shadow-xl">
    <h3 className="text-2xl font-semibold text-foreground mb-4">{title}</h3>
    <p className="text-muted-foreground mb-6">{description}</p>
    <Link href={href} className="inline-block px-6 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
      {buttonText}
    </Link>
  </div>
);

export default function ActionCards() {
  return (
    <section className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-12">
      <ActionCard
        title="I Need a Service"
        description="Find a professional who is experienced and ready to do any job. Get matched with service providers you can trust."
        buttonText="Find Services"
        href="/browse"
      />
      <ActionCard
        title="I Want to Offer Services"
        description="Turn your skills into income. Join the thousands of helpers who are already helping other people."
        buttonText="Offer Service"
        href="/onboarding/service-provider"
      />
    </section>
  );
}