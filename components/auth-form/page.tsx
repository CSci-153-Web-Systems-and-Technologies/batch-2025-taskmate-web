// components/auth-form.tsx
"use client";
import React, { useState } from 'react';
import { Mail, Lock, User, Facebook, Chrome } from 'lucide-react'; // Icons
import Image from 'next/image';

interface AuthFormProps {
  onSubmit: (formData: any, isRegister: boolean) => void;
  initialIsRegister: boolean;
  onToggleView: (isRegister: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, initialIsRegister, onToggleView }) => {
  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (registering: boolean) => {
    setIsRegister(registering);
    onToggleView(registering);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSubmit(formData, isRegister);
  };

  return (
    <div className="auth-card grid md:grid-cols-2 max-w-4xl w-full bg-card rounded-3xl shadow-2xl overflow-hidden">
      
      {/* Left Panel: Branding */}
      <div className="auth-branding-panel flex flex-col items-center justify-center p-8 text-white bg-primary">
        <h2 className="text-3xl font-light mb-4">Welcome to</h2>
        
        {/* Logo Group: Use flex-row for horizontal layout, center alignment */}
        <div className="flex items-center mb-6 space-x-2"> 
          <Image
            src="/taskmate-logo.svg" // Adjust size for just the logo mark
            alt="TaskMate Logo Icon"
            width={40} 
            height={40} 
          />
          {/* Text moves beside the logo icon */}
          <div className="text-5xl font-extrabold leading-none">
            <span className="text-green-300">Task</span>Mate
          </div>
        </div>
        
        <p className="text-sm text-center max-w-xs text-primary-foreground/90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Right Panel: Form */}
      <div className="auth-form-panel p-8 md:p-12">
        
        {/* Toggle Tabs */}
        <div className="flex mb-6 border-b border-border">
          <button 
            type="button"
            className={`text-lg font-semibold pb-2 mr-6 ${!isRegister ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => handleToggle(false)}
          >
            Login
          </button>
          <button 
            type="button"
            className={`text-lg font-semibold pb-2 ${isRegister ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => handleToggle(true)}
          >
            Register
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            
          {/* Register Fields (Name) */}
          {isRegister && (
            <div className="space-y-4">
              <label className="input-group">
                <div className='flex items-center text-muted-foreground'><User className='h-4 w-4 mr-2'/> Family Name</div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your family name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          )}

          {/* Email */}
          <label className="input-group">
            <div className='flex items-center text-muted-foreground'><Mail className='h-4 w-4 mr-2'/> Email Address</div>
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

          {/* Password */}
          <label className="input-group">
            <div className='flex items-center text-muted-foreground'><Lock className='h-4 w-4 mr-2'/> Password</div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
            />
          </label>
            
          {/* Confirm Password (Register Only) */}
          {isRegister && (
            <label className="input-group">
              <div className='flex items-center text-muted-foreground'><Lock className='h-4 w-4 mr-2'/> Confirm Password</div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-2 border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary"
              />
            </label>
          )}

          <div className="flex justify-between items-center text-xs pt-1">
            <label className="flex items-center space-x-1 text-muted-foreground">
              <input type="checkbox" name="rememberMe" className="rounded text-primary" />
              <span>Remember me</span>
            </label>
            {!isRegister && (
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            )}
          </div>
            
          <button type="submit" className="w-full py-2 mt-4 text-lg font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
            {isRegister ? 'Create Account' : 'Log In'}
          </button>

          <div className="social-login flex justify-center space-x-4 pt-4">
            <button type="button" className="p-2 border border-border rounded-full hover:bg-muted transition">
              <Facebook className="h-6 w-6 text-blue-600" />
            </button>
            <button type="button" className="p-2 border border-border rounded-full hover:bg-muted transition">
              <Chrome className="h-6 w-6 text-red-500" />
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm mt-6">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <a href="#" onClick={() => handleToggle(false)} className="text-primary hover:underline">Log In</a>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <a href="#" onClick={() => handleToggle(true)} className="text-primary hover:underline">Sign Up</a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthForm;