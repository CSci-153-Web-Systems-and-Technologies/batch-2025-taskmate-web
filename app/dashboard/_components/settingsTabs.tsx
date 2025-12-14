"use client";
import React, { useState } from 'react';
import ProfileTab from './profileTab';
import SecurityTab from './securityTab';

interface UserProfile {
    fullName: string;
    location: string;
    email: string;
    avatarUrl: string;
}

export default function SettingsTabs({ initialProfileData }: { initialProfileData: UserProfile }) {
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    return (
        <div className="max-w-4xl">
            <div className="flex bg-card p-1 rounded-xl shadow-inner mb-8 border border-border">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-2 font-semibold rounded-lg transition ${
                        activeTab === 'profile' ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 py-2 font-semibold rounded-lg transition ${
                        activeTab === 'security' ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                    Security
                </button>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
                {activeTab === 'profile' ? (
                    <ProfileTab initialData={initialProfileData} />
                ) : (
                    <SecurityTab />
                )}
            </div>
        </div>
    );
}