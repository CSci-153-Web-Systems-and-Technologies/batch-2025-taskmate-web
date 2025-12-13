"use client";
import React from 'react';
<<<<<<< Updated upstream
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabase/client'; 
import AuthForm from '@/components/auth-form/page'; 

const handleAuthSubmission = async (formData: any) => {
=======
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client'; 
import AuthForm from '@/components/auth-form/page'; 
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const handleAuthSubmission = async (formData: any, router: AppRouterInstance) => {
    
>>>>>>> Stashed changes
    const email = formData.email; 
    const password = formData.password;

    if (!email || !password) {
        alert("Please enter both email address and password.");
        return;
    }

<<<<<<< Updated upstream
    const uniqueEmail = email.includes('@') ? email : `${email.toLowerCase()}@taskmate.com`;

=======
>>>>>>> Stashed changes
    const { error } = await supabase.auth.signInWithPassword({
        email: email, 
        password: password,
    });
    
<<<<<<< Updated upstream
    const router = useRouter(); 
    
=======
>>>>>>> Stashed changes
    if (error) {
        alert(`Login Error: ${error.message}`);
    } else {
        router.push('/dashboard'); 
        router.refresh(); 
    }
};

export default function SignInPage() {
<<<<<<< Updated upstream
    const router = useRouter();

    const handleToggleView = (isRegister: boolean) => {
        if (isRegister) {
            router.push('/auth/signup');
=======
    const router = useRouter(); 

    const handleToggleView = (isRegister: boolean) => {
        if (isRegister) {
            router.push('/auth/signup'); 
>>>>>>> Stashed changes
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">
            <AuthForm 
<<<<<<< Updated upstream
                onSubmit={(data) => handleAuthSubmission(data)} 
=======
                onSubmit={(data) => handleAuthSubmission(data, router)} 
>>>>>>> Stashed changes
                initialIsRegister={false} 
                onToggleView={handleToggleView}
            />
        </div>
    );
}