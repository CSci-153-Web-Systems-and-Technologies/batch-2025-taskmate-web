import React from 'react';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react'; 

interface ProfessionalCardProps {
    professional: {
        id: string;
        full_name: string;
        username: string;
        description: string;
        rating: number;
        reviews_count: number;
        hourly_rate: number;
        location: string;
    };
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
    const formatCurrency = (amount: number) => {
        return `₱${amount.toFixed(0)}/hour`;
    };
    
    return (
        <div className="bg-card border border-border rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 border-4 border-primary/20">
            </div>

            <h3 className="text-xl font-semibold text-foreground">{professional.full_name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{professional.description.substring(0, 30)}...</p>

            <div className="flex items-center space-x-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">
                    {professional.rating.toFixed(1)} ({professional.reviews_count} reviews)
                </span>
            </div>

            <div className="text-lg font-bold text-primary mb-2">
                {formatCurrency(professional.hourly_rate)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{professional.location}</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                {professional.description}
            </p>
            
            <Link href={`/profile/${professional.username}`} className="w-full py-2 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition">
                View Profile →
            </Link>
        </div>
    );
};

export default ProfessionalCard;