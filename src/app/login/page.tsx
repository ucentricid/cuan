'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole, SalesRole } from '@/context/RoleContext';
import { Zap, Users, Tv, Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { loginUser } from '@/app/actions/auth';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useRole();
    const [activeRole, setActiveRole] = useState<SalesRole>('canvassing');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await loginUser(email, password, activeRole);

            if (result.success && result.user) {
                login(result.user.role, result.user.email, result.user.isActive);
                router.push('/');
            } else {
                setError(result.message || 'Login gagal.');
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi.');
        } finally {
            setIsLoading(false);
        }
    };

    const roles: { id: SalesRole; label: string; icon: any; color: string; desc: string }[] = [
        { id: 'canvassing', label: 'Canvassing', icon: Zap, color: 'amber', desc: 'Penjualan lapangan & kunjungan toko' },
        { id: 'sales_afiliator', label: 'Sales Afiliator', icon: Users, color: 'blue', desc: 'Promosi produk via link & sosmed' },
        { id: 'host_live', label: 'Host Live', icon: Tv, color: 'rose', desc: 'Jualan interaktif via streaming' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center"
            >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
                    <span className="text-white text-2xl font-black">C</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Masuk ke Cuan</h1>
                <p className="text-slate-500 text-sm mt-1">Kelola pendapatan sales kamu di sini</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
                {/* Role Selection Tabs */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Peran Sales</label>
                    <div className="grid grid-cols-3 gap-2">
                        {roles.map((r) => {
                            const Icon = r.icon;
                            const isActive = activeRole === r.id;
                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setActiveRole(r.id)}
                                    className={`flex flex-col items-center p-3 rounded-2xl transition-all border ${isActive
                                        ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-50'
                                        : 'bg-transparent border-slate-200 text-slate-400'
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-blue-500' : ''} />
                                    <span className={`text-[10px] font-bold mt-2 ${isActive ? 'text-slate-900' : ''}`}>{r.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Kata Sandi"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="text-right">
                    <button type="button" className="text-xs font-bold text-blue-600">Lupa sandi?</button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>Masuk Sekarang <ChevronRight size={18} /></>
                    )}
                </button>
            </form>

            <div className="mt-auto pt-10 text-center">
                <p className="text-sm text-slate-500">
                    Belum punya akun? <Link href="/register" className="text-blue-600 font-bold">Daftar</Link>
                </p>
            </div>
        </div>
    );
}
