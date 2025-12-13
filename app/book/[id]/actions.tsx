'use server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function createBooking(
    serviceId: string, 
    providerId: string, 
    hours: number, 
    totalPrice: number, 
    bookingDate: string
) {
    const supabase = await getServerSupabase();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        throw new Error("You must be logged in to book a service.");
    }

    const { data, error } = await supabase
        .from('bookings') 
        .insert([
            {
                customer_id: user.id,
                provider_id: providerId,
                service_id: serviceId,
                

                date: bookingDate,      
                time: `${hours} hours`,  
                amount: totalPrice,     
                status: 'Pending'      
            }
        ])
        .select()
        .single();

    if (error) {
        console.error("Supabase Booking Error:", error.message, error.details);
        throw new Error(`Failed to create booking: ${error.message}`);
    }

    return { success: true, bookingId: data.id };
}