// app/dashboard/settings/components/SecurityTab.tsx
"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Lock } from 'lucide-react';

const SecurityTab: React.FC = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { currentPassword, newPassword, confirmNewPassword } = formData;

        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match.");
            setLoading(false);
            return;
        }

        // NOTE: Supabase only allows password change if the user is signed in 
        // with the password strategy (not social login) AND if you verify the current password.
        // The standard Supabase password update function does NOT require the old password,
        // but for security, you should implement re-authentication first.
        
        // For simplicity (MVP): Directly update the password
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        setLoading(false);

        if (error) {
            alert(`Error updating password: ${error.message}`);
        } else {
            alert("Password updated successfully! Please log in with your new password.");
            setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        }
    };

    return (
        <form onSubmit={handlePasswordChange} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" /> Security Settings
            </h2>

            <div className="max-w-md space-y-4">
                <label className="block">
                    <span className="text-sm font-medium text-muted-foreground">Current Password</span>
                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter Current Password" required className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary" />
                </label>
                
                <label className="block">
                    <span className="text-sm font-medium text-muted-foreground">New Password</span>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter New Password" required className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary" />
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-muted-foreground">Confirm New Password</span>
                    <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} placeholder="Confirm New Password" required className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary" />
                </label>
            </div>

            <div className="pt-4">
                <button type="submit" disabled={loading} className="px-6 py-2 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 disabled:opacity-50 transition">
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default SecurityTab;