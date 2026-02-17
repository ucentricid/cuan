'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    TrendingUp,
    History
} from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';

export default function DompetPage() {
    const withdrawals = [
        {
            id: 'WD-8821',
            amount: 1250000,
            date: '17 Feb 2026',
            status: 'success',
            label: 'Berhasil'
        },
        {
            id: 'WD-8819',
            amount: 500000,
            date: '16 Feb 2026',
            status: 'pending',
            label: 'Pending'
        },
        {
            id: 'WD-8815',
            amount: 2100000,
            date: '15 Feb 2026',
            status: 'waiting',
            label: 'Menunggu Approval'
        },
        {
            id: 'WD-8810',
            amount: 750000,
            date: '14 Feb 2026',
            status: 'success',
            label: 'Berhasil'
        }
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'success':
                return { bg: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 };
            case 'pending':
                return { bg: 'bg-amber-50 text-amber-600', icon: Clock };
            case 'waiting':
                return { bg: 'bg-blue-50 text-blue-600', icon: AlertCircle };
            default:
                return { bg: 'bg-slate-50 text-slate-600', icon: Clock };
        }
    };

    return (
        <div className="min-h-screen bg-white pb-48">
            {/* Header - Sync with Home */}
            <header className="p-5 pb-4 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                        <h2 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Data Keuangan</h2>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Dompet & Saldo</h1>
                </div>
            </header>

            {/* Main Balance Card - Mirror Home Page */}
            <section className="px-5 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 p-7 rounded-[32px] text-white shadow-2xl shadow-slate-300 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 opacity-20 blur-[60px] -mr-24 -mt-24"></div>
                    <div className="relative z-10 text-center">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Total Saldo Tersedia</p>
                        <h2 className="text-4xl font-black tracking-tighter mb-10">
                            <span className="text-lg font-bold text-slate-500 mr-2">Rp</span>
                            4.580.000
                        </h2>

                        <div className="flex gap-3 justify-center">
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                Tarik Dana <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Statistics Row - Precise Layout */}
            <div className="px-5 grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-premium">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-4">Total Pendapatan</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">Rp 12.450k</p>
                    <div className="mt-2 text-[8px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-50 w-fit px-1.5 py-0.5 rounded">Berhasil</div>
                </div>
                <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-premium">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-4">Dalam Proses</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">Rp 2.100k</p>
                    <div className="mt-2 text-[8px] font-black text-amber-500 uppercase tracking-tighter bg-amber-50 w-fit px-1.5 py-0.5 rounded">Menunggu</div>
                </div>
            </div>

            {/* Transaction List - Sharp & Clean */}
            <div className="px-5 mt-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-3">Riwayat Transaksi</h3>
                    <button className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Lihat Semua</button>
                </div>

                <div className="space-y-3">
                    {withdrawals.map((wd, i) => {
                        const style = getStatusStyles(wd.status);
                        const StatusIcon = style.icon;

                        return (
                            <motion.div
                                key={wd.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-4 rounded-2xl border border-slate-50 shadow-premium flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center`}>
                                        <StatusIcon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 leading-none">Rp {wd.amount.toLocaleString('id-ID')}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{wd.date}</p>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{wd.id}</p>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Navigation removed - handled globally */}
        </div>
    );
}
