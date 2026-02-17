'use client';

import React from 'react';
import { Home, Wallet, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import { useRole } from '@/context/RoleContext';

export const BottomNav: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { isLoggedIn, isActive } = useRole();

    // Hide if not logged in or account not active
    if (!isLoggedIn || !isActive) return null;

    // Hide on login/register pages regardless
    if (['/login', '/register'].includes(pathname)) return null;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Wallet, label: 'Wallet', path: '/dompet' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] bg-slate-900/95 backdrop-blur-2xl flex justify-around items-center py-5 px-6 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[28px] border border-white/10">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                    <button
                        key={item.path}
                        onClick={() => router.push(item.path)}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-90 ${isActive ? 'text-blue-500' : 'text-slate-500'
                            }`}
                    >
                        <div className={`relative ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                            <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                            {isActive && (
                                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full blur-[2px] animate-pulse"></span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
