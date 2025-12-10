// app/auth/page.tsx
"use client";
import React, { useState } from 'react';
import AuthForm from '@/components/auth-form/page'; // Assuming you put the component in components/auth-form.tsx

export default function AuthPage() {
    // This state controls which view the AuthForm starts on
    const [isRegister, setIsRegister] = useState(false); 

    const handleAuthSubmission = (formData: any, registering: boolean) => {
        console.log('Form Data:', formData);
        if (registering) {
            console.log('Attempting Supabase Sign Up...');
            // Implement Supabase sign-up here
        } else {
            console.log('Attempting Supabase Login...');
            // Implement Supabase sign-in here
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">
            {/* Pass the initial view state and the handler to the form component */}
            <AuthForm 
                onSubmit={handleAuthSubmission} 
                initialIsRegister={isRegister}
                onToggleView={setIsRegister}
            />
        </div>
    );
}