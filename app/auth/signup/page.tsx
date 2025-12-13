"use client";
import React from 'react';
<<<<<<< Updated upstream
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client'; 
import AuthForm from '@/components/auth-form/page';

const handleAuthSubmission = async (formData: any) => {
    const router = useRouter(); 
    
=======
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabase/client'; 
import AuthForm from '@/components/auth-form/page'; 
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const handleAuthSubmission = async (formData: any, router: AppRouterInstance) => {
    

>>>>>>> Stashed changes
    const email = formData.email; 
    const password = formData.password;

    if (!email || !password || formData.password !== formData.confirmPassword) {
        alert("Please ensure all fields are filled and passwords match.");
        return;
    }
    
<<<<<<< Updated upstream

    const { error, data } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                fullname: formData.fullname,
                username: formData.username,
                role: formData.role, 
            }
        }
=======
    const { error, data } = await supabase.auth.signUp({
        email: email, 
        password: password,
        options: { data: { fullname: formData.fullname, role: formData.role } }
>>>>>>> Stashed changes
    });

    if (error) {
        alert(`Sign Up Error: ${error.message}`);
    } else if (data.user) {
        alert('Success! Account created. Redirecting to dashboard.');
<<<<<<< Updated upstream
        router.push('/dashboard'); 
=======
        router.push('/dashboard');
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            router.push('/auth/signin');
=======
            router.push('/auth/signin'); 
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
                initialIsRegister={true} 
                onToggleView={handleToggleView}
            />
        </div>
    );
}