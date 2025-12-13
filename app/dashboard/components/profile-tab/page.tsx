"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';

interface UserProfile {
    fullName: string;
    location: string;
    email: string;
    avatarUrl: string;
}

const ProfileTab: React.FC<{ initialData: UserProfile }> = ({ initialData }) => {
    const [formData, setFormData] = useState({
        fullName: initialData.fullName,
        location: initialData.location,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { fullName, location } = formData;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Must be logged in to save.");
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ fullname: fullName, location: location })
            .eq('id', user.id);

        setLoading(false);

        if (error) {
            alert(`Error updating profile: ${error.message}`);
        } else {
            alert("Profile updated successfully!");
        }
    };

    const [givenName, lastName] = formData.fullName.split(' ').filter(Boolean);

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-muted-foreground">Last Name</span>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName || ''}
                            onChange={(e) => { /* Complex state update for full name */ }}
                            disabled 
                            className="w-full p-2 border border-border rounded-lg bg-input/50 disabled:bg-gray-700/50"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-muted-foreground">Given Name</span>
                        <input
                            type="text"
                            name="givenName"
                            value={givenName || ''}
                            onChange={(e) => { /* Complex state update for full name */ }}
                            disabled
                            className="w-full p-2 border border-border rounded-lg bg-input/50 disabled:bg-gray-700/50"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <input
                            type="email"
                            value={initialData.email}
                            disabled
                            className="w-full p-2 border border-border rounded-lg bg-input/50 disabled:bg-gray-700/50"
                        />
                    </label>
                    
                    <label className="block">
                        <span className="text-sm font-medium text-muted-foreground">Location</span>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
                        />
                    </label>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col items-center p-4 border border-border rounded-lg bg-muted">
                        <div className="w-24 h-24 relative rounded-full mb-3">
                            <Image src={initialData.avatarUrl} alt="Avatar" layout="fill" objectFit="cover" className="rounded-full" />
                        </div>
                        <button type="button" className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
                            Change Photo
                        </button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-md font-medium">Notifications</h3>
                        <div className="flex justify-between items-center text-sm">
                            <span>Email notifications</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded" />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Booking updates</span>
                            <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 text-right">
                <button type="submit" disabled={loading} className="px-6 py-2 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 disabled:opacity-50 transition">
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default ProfileTab;