// app/auth/page.tsx
"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import AuthForm from '@/components/auth-form/page'; 
import { useRouter } from 'next/navigation';

const handleAuthSubmission = async (formData: any, registering: boolean) => {
    if (registering) {
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName, 
                    username: formData.username,
                    role: formData.role,
                }
            }
        });

        if (error) {
            alert(`Sign Up Error: ${error.message}`);
        } else {
            alert('Success! Check your email to confirm your account.');
        }
    } else {
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            alert(`Login Error: ${error.message}`);
        } else {
            window.location.href = '/dashboard'; 
        }
    }
};

export default function AuthPage() {
    const [isRegister, setIsRegister] = useState(false); 

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">
            <AuthForm 
                onSubmit={handleAuthSubmission} 
                initialIsRegister={isRegister}
                onToggleView={setIsRegister}
            />
        </div>
    );
}