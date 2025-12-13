import React from 'react';
import { getServerSupabase } from '@/lib/supabase/server';
<<<<<<< Updated upstream
import ProviderDashboardSidebar from '../../components/provider-sidebar/page'; 
import { Star, User } from 'lucide-react';
=======
import ProviderDashboardSidebar from '../../components/provider-sidebar'; 
import { Star } from 'lucide-react';
>>>>>>> Stashed changes

interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
    serviceTitle: string;
<<<<<<< Updated upstream
=======
    serviceId: string;
>>>>>>> Stashed changes
}

interface RatingMetrics {
    overallRating: number;
    totalReviews: number;
    positiveReviewsPercentage: number;
    reviews: Review[];
}

<<<<<<< Updated upstream
async function fetchProviderReviews(): Promise<RatingMetrics> {
    const supabase = await getServerSupabase();
=======
async function fetchProviderReviews(filterServiceId?: string): Promise<RatingMetrics> {
    const supabase = await getServerSupabase();
    if (!supabase) return { overallRating: 0, totalReviews: 0, positiveReviewsPercentage: 0, reviews: [] };
    
>>>>>>> Stashed changes
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
         return { overallRating: 0, totalReviews: 0, positiveReviewsPercentage: 0, reviews: [] };
    }

    const { data: rawReviews, error } = await supabase
        .from('reviews')
<<<<<<< Updated upstream
        .select(`
            id, rating, comment, created_at,
            customer:profiles!fk_customer (fullname),
            service:services!fk_service (title)
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });
        
    if (error) {
        console.error("Error fetching reviews:", error);
        return { overallRating: 0, totalReviews: 0, positiveReviewsPercentage: 0, reviews: [] };
    }
    
    const reviews: Review[] = rawReviews.map(r => ({
        id: r.id, 
        customerName: r.customer?.fullname || 'Customer',
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Simplify date
        serviceTitle: r.service?.title || 'Service Missing',
    }));

=======
        .select('id, rating, comment, created_at, customer_id, booking_id') 
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });
        
    if (error || !rawReviews?.length) {
        if (error) console.error("Error fetching reviews:", error);
        return { overallRating: 0, totalReviews: 0, positiveReviewsPercentage: 0, reviews: [] };
    }
    
    const customerIds = rawReviews.map(r => r.customer_id);
    const bookingIds = rawReviews.map(r => r.booking_id);

    const { data: customersData } = await supabase
        .from('profiles')
        .select('id, fullname')
        .in('id', customerIds);

    const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, service_id')
        .in('id', bookingIds);

    const serviceIds = bookingsData?.map(b => b.service_id) || [];

    const { data: servicesData } = await supabase
        .from('services')
        .select('id, title')
        .in('id', serviceIds);

    const customerMap = new Map(customersData?.map(c => [c.id, c]) || []);
    const bookingMap = new Map(bookingsData?.map(b => [b.id, b]) || []);
    const serviceMap = new Map(servicesData?.map(s => [s.id, s]) || []);

    let reviews: Review[] = rawReviews.map(r => {
        const customer = customerMap.get(r.customer_id);
        const booking = bookingMap.get(r.booking_id);
        const service = booking ? serviceMap.get(booking.service_id) : null;

        return {
            id: r.id, 
            customerName: customer?.fullname || 'Unknown Customer',
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            serviceTitle: service?.title || 'Service Unavailable',
            serviceId: service?.id || '',
        };
    });

    // 9. Apply Filter
    if (filterServiceId) {
        reviews = reviews.filter(r => r.serviceId === filterServiceId);
    }

    // 10. Metrics Logic
>>>>>>> Stashed changes
    const totalReviews = reviews.length;
    const totalRatingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const overallRating = totalReviews > 0 ? (totalRatingSum / totalReviews) : 0;
    
    const positiveReviewsCount = reviews.filter(r => r.rating >= 4).length;
    const positiveReviewsPercentage = totalReviews > 0 ? Math.round((positiveReviewsCount / totalReviews) * 100) : 0;

    return {
<<<<<<< Updated upstream
        overallRating: overallRating,
        totalReviews: totalReviews,
        positiveReviewsPercentage: positiveReviewsPercentage,
        reviews: reviews,
    };
}


const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-background p-4 rounded-lg border border-border flex justify-between items-start">
        
=======
        overallRating,
        totalReviews,
        positiveReviewsPercentage,
        reviews,
    };
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-background p-4 rounded-lg border border-border flex justify-between items-start">
>>>>>>> Stashed changes
        <div className="space-y-1 w-3/4">
            <div className="flex items-center space-x-2 text-sm">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200"></div>
                <span className="font-semibold text-foreground">{review.customerName}</span>
            </div>
<<<<<<< Updated upstream

            <div className="flex items-center text-yellow-600 text-xs">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                    />
=======
            <div className="flex items-center text-yellow-600 text-xs">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
>>>>>>> Stashed changes
                ))}
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-medium">{review.serviceTitle}</p>
            <p className="text-sm text-foreground italic">"{review.comment}"</p>
        </div>
<<<<<<< Updated upstream
        
=======
>>>>>>> Stashed changes
        <span className="text-xs text-muted-foreground">{review.date}</span>
    </div>
);

<<<<<<< Updated upstream
const RatingMetricCard: React.FC<{ title: string, value: string | number, iconColor: string }> = ({ title, value, iconColor }) => (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border flex flex-col items-center justify-center text-center">
        <h3 className="text-4xl font-bold text-foreground mb-1">{value}</h3>
=======
const RatingMetricCard: React.FC<{ title: string, value: React.ReactNode, iconColor: string }> = ({ title, value, iconColor }) => (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-bold text-foreground mb-1 flex justify-center items-center">
            {value}
        </div>
>>>>>>> Stashed changes
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
    </div>
);


<<<<<<< Updated upstream
export default async function ProviderRatingPage() {
    const { overallRating, totalReviews, positiveReviewsPercentage, reviews } = await fetchProviderReviews();
=======
interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProviderRatingPage(props: PageProps) {
    const searchParams = await props.searchParams; 
    
    const serviceId = typeof searchParams.service_id === 'string' ? searchParams.service_id : undefined;

    const { overallRating, totalReviews, positiveReviewsPercentage, reviews } = await fetchProviderReviews(serviceId);
>>>>>>> Stashed changes

    return (
        <div className="min-h-screen bg-muted flex">
            <ProviderDashboardSidebar />
            
            <main className="flex-1 p-8 ml-64"> 
                <h1 className="text-3xl font-bold text-foreground mb-2">Customer Ratings & Reviews</h1>
<<<<<<< Updated upstream
                <p className="text-muted-foreground mb-8">See what customers are saying about your service quality.</p>
=======
                <p className="text-muted-foreground mb-8">
                    {serviceId ? 'Showing reviews for selected service.' : 'See what customers are saying about your service quality.'}
                </p>
>>>>>>> Stashed changes

                <div className="grid grid-cols-3 gap-6 mb-10">
                    <RatingMetricCard 
                        title="Overall Rating" 
                        value={
                            <div className="flex items-center justify-center">
                                {overallRating.toFixed(1)} <Star className="w-5 h-5 ml-1 fill-yellow-500 text-yellow-500" />
                            </div>
                        }
                        iconColor="text-yellow-500"
                    />
<<<<<<< Updated upstream
                    <RatingMetricCard 
                        title="Total Reviews" 
                        value={totalReviews} 
                        iconColor="text-blue-500"
                    />
                    <RatingMetricCard 
                        title="Positive Reviews" 
                        value={`${positiveReviewsPercentage}%`} 
                        iconColor="text-green-500"
                    />
=======
                    <RatingMetricCard title="Total Reviews" value={totalReviews} iconColor="text-blue-500" />
                    <RatingMetricCard title="Positive Reviews" value={`${positiveReviewsPercentage}%`} iconColor="text-green-500" />
>>>>>>> Stashed changes
                </div>
                
                <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Reviews</h2>
<<<<<<< Updated upstream
                    
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <div className="text-center p-6 text-muted-foreground">
                                No customer reviews yet.
                            </div>
                        ) : (
                            reviews.map(review => (
                                <ReviewCard key={review.id} review={review} />
                            ))
=======
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <div className="text-center p-6 text-muted-foreground">No customer reviews found.</div>
                        ) : (
                            reviews.map(review => <ReviewCard key={review.id} review={review} />)
>>>>>>> Stashed changes
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}