// app/dashboard/provider/services/new/components/AddServiceForm.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Save, Loader2, DollarSign } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface AddServiceFormProps {
    categories: Category[];
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({ categories }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        category_id: categories.length > 0 ? categories[0].id.toString() : '',
        price: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.title || !formData.category_id || !formData.price || !formData.description) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return false;
        }
        if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            setMessage({ type: 'error', text: 'Price must be a valid positive number.' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setMessage(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setMessage({ type: 'error', text: 'You must be logged in to add a service.' });
            setLoading(false);
            return;
        }
        
        const numericPrice = parseFloat(formData.price);
        const numericCategoryId = parseInt(formData.category_id);

        const newService = {
            provider_id: user.id,
            category_id: numericCategoryId,
            title: formData.title,
            description: formData.description,
            price: numericPrice,
            is_published: true, // Auto-publish new services
        };

        const { error } = await supabase
            .from('services')
            .insert([newService]);

        setLoading(false);

        if (error) {
            console.error("Supabase insert error:", error);
            setMessage({ type: 'error', text: `Failed to add service: ${error.message}` });
        } else {
            setMessage({ type: 'success', text: 'Service added successfully! Redirecting...' });
            
            // Redirect back to the main My Services list
            setTimeout(() => {
                router.push('/dashboard/provider/services');
            }, 1500);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-lg border border-border max-w-3xl space-y-6">
            
            {/* Display message/alert */}
            {message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Service Title */}
            <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-1 block">Service Title</span>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Emergency Plumbing Repair"
                    className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
                    required
                />
            </label>

            {/* Category and Price Grid */}
            <div className="grid grid-cols-2 gap-6">
                
                {/* Category Dropdown */}
                <label className="block">
                    <span className="text-sm font-medium text-muted-foreground mb-1 block">Category</span>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary appearance-none"
                        required
                    >
                        {categories.length > 0 ? (
                            categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))
                        ) : (
                            <option value="">No categories available</option>
                        )}
                    </select>
                </label>

                {/* Price (Hourly Rate) */}
                <label className="block">
                    <span className="text-sm font-medium text-muted-foreground mb-1 block">Price (Hourly Rate / Fixed)</span>
                    <div className="relative">
                        <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="500.00"
                            min="0"
                            step="0.01"
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                </label>
            </div>

            {/* Service Description */}
            <label className="block">
                <span className="text-sm font-medium text-muted-foreground mb-1 block">Service Description</span>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the service, what it includes, and your expertise..."
                    rows={6}
                    className="w-full p-3 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary resize-none"
                    required
                />
            </label>

            {/* Submit Button */}
            <div className="pt-4 text-right">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex items-center justify-center ml-auto px-6 py-3 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 disabled:opacity-50 transition"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            Save Service
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddServiceForm;