"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client'; 
import AuthForm from '@/components/auth-form/page'; 

const handleAuthSubmission = async (formData: any, registering: boolean) => {
    
    const uniqueEmail = `${formData.username.toLowerCase()}@taskmate.com`;
    
    if (registering) {
        const { error } = await supabase.auth.signUp({
            email: uniqueEmail, 
            password: formData.password,
            options: {
                data: {
                    fullname: formData.fullname,
                    username: formData.username,
                    role: formData.role, 
                }
            }
        });

        if (error) {
            alert(`Sign Up Error: ${error.message}`);
        } else {
            alert('Success! Your account is created (using username for login).');
        }
    } else {
        const { error } = await supabase.auth.signInWithPassword({
            email: uniqueEmail,
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