'use client';

import React from 'react';
import { useRole, SalesRole } from '@/context/RoleContext';
import { Zap, Users, Tv } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
    const { role, setRole } = useRole();

    const options: { id: SalesRole; label: string; icon: any; color: string }[] = [
        { id: 'canvassing', label: 'Canvassing', icon: Zap, color: 'text-amber-500' },
        { id: 'sales_afiliator', label: 'Sales Afiliator', icon: Users, color: 'text-blue-500' },
        { id: 'host_live', label: 'Host Live', icon: Tv, color: 'text-rose-500' },
    ];

    return (
        <div className="px-8 mb-6">
            <div className="flex gap-2">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = role === opt.id;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => setRole(opt.id)}
                            className={`flex-1 flex flex-col items-center p-3 rounded-2xl border transition-all ${isActive
                                ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-50'
                                : 'bg-transparent border-slate-100 text-slate-400 opacity-60'
                                }`}
                        >
                            <Icon size={20} className={isActive ? opt.color : ''} />
                            <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-slate-900' : ''}`}>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
