// app/dashboard/payment/components/PaymentHistoryList.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TransactionData {
    id: string;
    providerFullName: string;
    providerUsername: string;
    serviceTitle: string;
    amount: number;
    transactionDate: string;
    rating: number;
    hourlyRate: number;
}

interface PaymentHistoryListProps {
    history: TransactionData[];
}

const formatCurrency = (amount: number) => `₱${amount.toLocaleString()}`;

const HistoryCard: React.FC<{ transaction: TransactionData }> = ({ transaction }) => {
    return (
        <div className="bg-card p-6 rounded-xl shadow-md border border-border flex items-center justify-between transition hover:shadow-lg">
            
            {/* Left Section: Provider Info */}
            <div className="flex items-center space-x-4">
                {/* Avatar Placeholder */}
                <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
                    {/* Placeholder image here */}
                </div>
                
                <div>
                    <Link href={`/profile/${transaction.providerUsername}`} className="text-lg font-semibold text-foreground hover:text-primary transition">
                        {transaction.providerFullName}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-1">{transaction.serviceTitle}</p>
                    
                    <div className="flex items-center space-x-2 text-sm">
                        {/* Rating */}
                        <div className="flex items-center text-yellow-600">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                            <span>{transaction.rating.toFixed(1)}</span>
                        </div>
                        {/* Hourly Rate */}
                        <span className="font-medium text-muted-foreground">{formatCurrency(transaction.hourlyRate)}/hour</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Amount and Date */}
            <div className="flex flex-col items-end space-y-2 text-sm font-semibold">
                <span className="text-xl font-bold text-foreground">{formatCurrency(transaction.amount)}</span>
                <span className="text-muted-foreground">{transaction.transactionDate}</span>
                {/* Rate Now Button (for transactions not yet rated) */}
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-xs">
                    Rate Now
                </button>
            </div>
        </div>
    );
};

export default function PaymentHistoryList({ history }: PaymentHistoryListProps) {
    if (history.length === 0) {
        return (
            <div className="text-center p-10 bg-card rounded-xl border border-border">
                <h2 className="text-xl font-semibold mb-2">No Transactions Found</h2>
                <p className="text-muted-foreground">Your payment history is empty.</p>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            {history.map(transaction => (
                <HistoryCard key={transaction.id} transaction={transaction} />
            ))}
        </section>
    );
}