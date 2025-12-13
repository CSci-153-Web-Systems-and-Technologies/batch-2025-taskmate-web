"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabase/client'; 
import AuthForm from '@/components/auth-form/page'; 

const handleAuthSubmission = async (formData: any) => {
    const email = formData.email; 
    const password = formData.password;

    if (!email || !password) {
        alert("Please enter both email address and password.");
        return;
    }

    const uniqueEmail = email.includes('@') ? email : `${email.toLowerCase()}@taskmate.com`;

    const { error } = await supabase.auth.signInWithPassword({
        email: email, 
        password: password,
    });
    
    const router = useRouter(); 
    
    if (error) {
        alert(`Login Error: ${error.message}`);
    } else {
        router.push('/dashboard'); 
        router.refresh(); 
    }
};

export default function SignInPage() {
    const router = useRouter();

    const handleToggleView = (isRegister: boolean) => {
        if (isRegister) {
            router.push('/auth/signup');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">
            <AuthForm 
                onSubmit={(data) => handleAuthSubmission(data)} 
                initialIsRegister={false} 
                onToggleView={handleToggleView}
            />
        </div>
    );
}