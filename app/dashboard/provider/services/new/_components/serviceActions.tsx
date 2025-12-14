"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client'; 

export default function ServiceActions({ serviceId }: { serviceId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this service? This cannot be undone.")) return;

        setLoading(true);
        
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', serviceId);

        if (error) {
            alert("Error deleting service: " + error.message);
            setLoading(false);
        } else {
            router.refresh();
            setLoading(false);
        }
    };

    return (
        <div className="flex space-x-3">
            <Link 
                href={`/dashboard/provider/services/${serviceId}`} 
                className="p-2 text-primary hover:text-primary/80 transition rounded-full hover:bg-muted"
                title="Edit Service"
            >
                <Edit2 className="h-5 w-5" />
            </Link>
            
            <button 
                onClick={handleDelete} 
                disabled={loading}
                className="p-2 text-red-500 hover:text-red-700 transition rounded-full hover:bg-muted disabled:opacity-50"
                title="Delete Service"
            >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </button>
        </div>
    );
}