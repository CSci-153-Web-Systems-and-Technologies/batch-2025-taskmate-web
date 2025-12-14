"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabase/client'; 
import AuthForm from '@/components/auth-form/page'; 
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const handleAuthSubmission = async (formData: any, router: AppRouterInstance) => {
    

    const email = formData.email; 
    const password = formData.password;

    if (!email || !password || formData.password !== formData.confirmPassword) {
        alert("Please ensure all fields are filled and passwords match.");
        return;
    }
    
    const { error, data } = await supabase.auth.signUp({
        email: email, 
        password: password,
        options: { data: { fullname: formData.fullname, role: formData.role } }
    });

    if (error) {
        alert(`Sign Up Error: ${error.message}`);
    } else if (data.user) {
        alert('Success! Account created. Redirecting to dashboard.');
        router.push('/dashboard');
        router.refresh(); 
    } else {
        alert('Registration complete! Please check your email to confirm your account.');
        router.push('/');
    }
};

export default function SignUpPage() {
    const router = useRouter();

    const handleToggleView = (isRegister: boolean) => {
        if (!isRegister) {
            router.push('/auth/signin'); 
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">
            <AuthForm 
                onSubmit={(data) => handleAuthSubmission(data, router)} 
                initialIsRegister={true} 
                onToggleView={handleToggleView}
            />
        </div>
    );
}