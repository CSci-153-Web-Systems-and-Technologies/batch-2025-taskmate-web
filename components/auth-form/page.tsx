"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, User, Mail, AtSign } from 'lucide-react';

interface AuthFormProps {
    onSubmit: (formData: any, isRegister: boolean) => void;
    initialIsRegister: boolean;
    onToggleView: (isRegister: boolean) => void;
}

interface FormData {
    fullname: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'customer' | 'provider';
    termsAgreed: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, initialIsRegister, onToggleView }) => {
    const [isRegister, setIsRegister] = useState(initialIsRegister);
    const [formData, setFormData] = useState<FormData>({
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        termsAgreed: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleToggle = (registering: boolean) => {
        setIsRegister(registering);
        onToggleView(registering);
    };

    const handleRoleSelect = (role: 'customer' | 'provider') => {
        setFormData(prev => ({ ...prev, role }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegister) {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords don't match!");
                return;
            }
            if (!formData.termsAgreed) {
                alert("You must agree to the Terms of Service and Privacy Policy.");
                return;
            }
        }
        onSubmit(formData, isRegister);
    };

    return (
        <div className="auth-card grid md:grid-cols-2 max-w-4xl w-full bg-card rounded-3xl shadow-2xl overflow-hidden">

            <div className="auth-branding-panel flex flex-col items-center justify-center p-8 text-white bg-primary">
                <h2 className="text-3xl font-light mb-4">Welcome to</h2>

                <div className="flex items-center mb-6 space-x-2">
                    <Image src="/taskmate-logo.svg" alt="TaskMate Logo Icon" width={40} height={40} />
                    <div className="text-5xl font-extrabold leading-none">
                        <span className="text-green-300">Task</span>Mate
                    </div>
                </div>

                <p className="text-sm text-center max-w-xs text-primary-foreground/90">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>

            <div className="auth-form-panel p-8 md:p-12">

                <div className="flex mb-6 border-b border-border">
                    <button type="button" className={`text-lg font-semibold pb-2 mr-6 ${!isRegister ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`} onClick={() => handleToggle(false)}>Login</button>
                    <button type="button" className={`text-lg font-semibold pb-2 ${isRegister ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`} onClick={() => handleToggle(true)}>Register</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {isRegister && (
                        <div className="space-y-4">
                            <div className="pt-2">
                                <p className="text-sm font-medium mb-2 text-foreground">I want to be a:</p>
                                <div className="flex space-x-4">
                                    <button type="button" onClick={() => handleRoleSelect('customer')} className={`flex-1 py-2 rounded-lg font-semibold transition ${formData.role === 'customer' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Customer</button>
                                    <button type="button" onClick={() => handleRoleSelect('provider')} className={`flex-1 py-2 rounded-lg font-semibold transition ${formData.role === 'provider' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Provider</button>
                                </div>
                            </div>

                            <label className="input-group">
                                <div className='flex items-center text-muted-foreground'><User className='h-4 w-4 mr-2' /> Full Name</div>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Enter your full name"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
                                />
                            </label>

                            <label className="input-group">
                                <div className='flex items-center text-muted-foreground'><AtSign className='h-4 w-4 mr-2' /> Username</div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Choose a username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
                                />
                            </label>

                        </div>
                    )}

                    <label className="input-group">
                        <div className='flex items-center text-muted-foreground'><Mail className='h-4 w-4 mr-2' /> Email Address</div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
                        />
                    </label>

                    <label className="input-group">
                        <div className='flex items-center text-muted-foreground'><Lock className='h-4 w-4 mr-2' /> Password</div>
                        <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary" />
                    </label>

                    {isRegister && (
                        <label className="input-group">
                            <div className='flex items-center text-muted-foreground'><Lock className='h-4 w-4 mr-2' /> Confirm Password</div>
                            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary" />
                        </label>
                    )}

                    {isRegister && (
                        <label className="flex items-center space-x-2 text-xs text-muted-foreground pt-2">
                            <input type="checkbox" name="termsAgreed" checked={formData.termsAgreed} onChange={handleChange} required className="rounded text-primary" />
                            <span>
                                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                            </span>
                        </label>
                    )}

                    {!isRegister && (
                        <div className="flex justify-between items-center text-xs pt-1">
                            <label className="flex items-center space-x-1 text-muted-foreground">
                                <input type="checkbox" name="rememberMe" className="rounded text-primary" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-primary hover:underline">Forgot password?</a>
                        </div>
                    )}

                    <button type="submit" className="w-full py-2 mt-4 text-lg font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                        {isRegister ? 'Create Account' : 'Log In'}
                    </button>

                    <div className="text-center text-sm mt-6">
                        {isRegister ? (
                            <span>
                                Already have an account?{' '}
                                <span onClick={() => handleToggle(false)} className="text-primary hover:underline cursor-pointer">Sign In</span>
                            </span>
                        ) : (
                            <span>
                                Don't have an account?{' '}
                                <span onClick={() => handleToggle(true)} className="text-primary hover:underline cursor-pointer">Sign Up</span>
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AuthForm;