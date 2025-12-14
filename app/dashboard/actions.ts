'use server';

import { getServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateBookingStatus(
    bookingId: string, 
    newStatus: 'Confirmed' | 'Rejected' | 'Cancelled' 
) {
    const supabase = await getServerSupabase();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus }) 
        .eq('id', bookingId);

    if (error) {
        console.error("Error updating booking:", error);
        throw new Error("Failed to update booking");
    }

    revalidatePath('/dashboard');
    return { success: true };
}