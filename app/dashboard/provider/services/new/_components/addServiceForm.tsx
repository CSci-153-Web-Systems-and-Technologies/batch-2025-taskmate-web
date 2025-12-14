"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Save, Loader2, DollarSign } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface ServiceData {
    id?: string;
    title: string;
    category_id: number;
    price: number;
    description: string;
}

interface ServiceFormProps {
    categories: Category[];
    initialData?: ServiceData | null;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ categories, initialData }) => {
    const router = useRouter();
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        category_id: initialData?.category_id?.toString() || (categories.length > 0 ? categories[0].id.toString() : ''),
        price: initialData?.price?.toString() || '',
        description: initialData?.description || '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setMessage({ type: 'error', text: 'You must be logged in.' });
            setLoading(false);
            return;
        }

        const payload = {
            provider_id: user.id,
            category_id: parseInt(formData.category_id),
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            is_published: true,
        };

        let error;

        if (isEditMode && initialData?.id) {
            const res = await supabase.from('services').update(payload).eq('id', initialData.id);
            error = res.error;
        } else {
            const res = await supabase.from('services').insert([payload]);
            error = res.error;
        }

        setLoading(false);

        if (error) {
            setMessage({ type: 'error', text: `Failed to save: ${error.message}` });
        } else {
            setMessage({ type: 'success', text: 'Service saved successfully!' });
            router.refresh();
            setTimeout(() => {
                router.push('/dashboard/provider/services');
            }, 1000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-lg border border-border max-w-3xl space-y-6">
            <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>
            
            {message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-1 block">Service Title</span>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary" placeholder="e.g. Car Repair"/>
            </label>

            <div className="grid grid-cols-2 gap-6">
                <label className="block">
                    <span className="text-sm font-medium text-muted-foreground mb-1 block">Category</span>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary appearance-none">
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-muted-foreground mb-1 block">Price</span>
                    <div className="relative">
                        <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required className="w-full p-3 pl-10 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"/>
                    </div>
                </label>
            </div>

            <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-1 block">Description</span>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={6} required className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary resize-none"/>
            </label>

            <div className="pt-4 text-right">
                <button type="submit" disabled={loading} className="flex items-center justify-center ml-auto px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 disabled:opacity-50 transition">
                    {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                    {isEditMode ? 'Update Service' : 'Save Service'}
                </button>
            </div>
        </form>
    );
};

export default ServiceForm;