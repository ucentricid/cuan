'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Shield,
    LogOut,
    BadgeCheck,
    Bell,
    Search,
    Lock as LockIcon
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { useRouter } from 'next/navigation';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { AddPaymentModal } from '@/components/ui/AddPaymentModal';
import { useState, useEffect } from 'react';
import { upsertPaymentAccount, getPaymentAccounts } from '@/app/actions/payment';
import { Edit2, Building2, Wallet as WalletIcon } from 'lucide-react';

export default function ProfilePage() {
    const { roleName, userEmail, logout, isActive } = useRole();
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [paymentAccount, setPaymentAccount] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userEmail) {
            fetchAccounts();
        }
    }, [userEmail]);

    const fetchAccounts = async () => {
        if (!userEmail) return;
        const result = await getPaymentAccounts(userEmail);
        if (result.success) {
            setPaymentAccount(result.account);
        }
        setIsLoading(false);
    };

    const handleUpsertAccount = async (data: any) => {
        if (!userEmail) return;
        const result = await upsertPaymentAccount(userEmail, data);
        if (result.success) {
            // Immediately update local state with the returned account
            setPaymentAccount(result.account);
            setShowAddModal(false);

            // Optionally fetch to ensure sync, but UI is already updated
            fetchAccounts();
        } else {
            alert(result.message);
        }
    };

    const handleEditAccount = () => {
        setShowAddModal(true);
    };

    const handleConfirmLogout = () => {
        logout();
        router.push('/login');
    };

    const getInitials = (email: string | null) => {
        if (!email) return 'U';
        return email.charAt(0).toUpperCase();
    };

    const renderAccountCard = (account: any) => {
        const isBankType = account.type === 'BANK';
        const icon = isBankType ? Building2 : WalletIcon;
        const colorClass = isBankType ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100';

        return (
            <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-premium flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${colorClass}`}>
                        {React.createElement(icon, { size: 22 })}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{account.providerName}</p>
                            <span className="text-[8px] font-black text-slate-400 italic">#{account.accountNumber}</span>
                        </div>
                        <p className="text-xs font-black text-slate-900 tracking-tight">{account.accountName}</p>
                    </div>
                </div>
                <button
                    onClick={handleEditAccount}
                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl transition-all flex items-center justify-center hover:bg-blue-600 hover:text-white active:scale-95"
                >
                    <Edit2 size={16} />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white pb-48">
            {/* Header - Identical to Home */}
            <header className="p-5 pb-4 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                        <h2 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Pengaturan</h2>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Profil Akun</h1>
                </div>
            </header>

            {/* Identity Center - Clean & Focused */}
            <section className="px-5 pt-4 mb-8 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative mb-6"
                >
                    <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full"></div>
                    <div className="relative w-24 h-24 bg-white p-2 rounded-[32px] border border-slate-100 shadow-xl">
                        <div className="w-full h-full bg-slate-900 rounded-[24px] flex items-center justify-center text-white text-3xl font-black">
                            {getInitials(userEmail)}
                        </div>
                    </div>
                    {isActive && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                            <BadgeCheck size={16} />
                        </div>
                    )}
                </motion.div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{userEmail?.split('@')[0]}</h3>
                <p className="text-xs text-slate-400 font-bold tracking-tight mb-4">{userEmail}</p>
            </section>

            {/* Role Card - Revenue Style from Home */}
            <section className="px-5 mb-8">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-premium flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Level Akses</p>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{roleName}</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Accounts Section */}
            <section className="px-5 mb-10">
                <div className="mb-4 px-1">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Rekening & E-wallet</h3>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="bg-slate-50 rounded-[24px] p-8 flex flex-col items-center justify-center border border-slate-100 border-dashed">
                            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memuat Data...</p>
                        </div>
                    ) : paymentAccount ? (
                        renderAccountCard(paymentAccount)
                    ) : null}
                </div>
            </section>

            {/* Logout - Simple & Direct */}
            <section className="px-5">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl font-black text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-rose-100"
                >
                    <LogOut size={18} /> Logout Akun
                </button>
            </section>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />

            <AddPaymentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleUpsertAccount}
                editingAccount={paymentAccount}
                accountType={paymentAccount?.type}
            />

            {/* Bottom Navigation removed - handled globally */}
        </div>
    );
}
