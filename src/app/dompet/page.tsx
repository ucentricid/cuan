'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    TrendingUp,
    History,
    XCircle,
    Copy,
    Check
} from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import { getWithdrawals, cancelWithdrawal } from '@/app/actions/withdraw';
import { useRole } from '@/context/RoleContext';

export default function DompetPage() {
    const { userEmail } = useRole();
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState<string | null>(null);

    const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

    useEffect(() => {
        if (userEmail) {
            fetchHistory();
        }
    }, [userEmail]);

    const fetchHistory = async () => {
        if (!userEmail) return;
        const result = await getWithdrawals(userEmail);
        if (result.success && result.data) {
            setWithdrawals(result.data);
        }
        setIsLoading(false);
    };

    const handleCancelClick = (id: string) => {
        setConfirmCancelId(id);
    };

    const proceedCancel = async () => {
        if (!confirmCancelId) return;

        setIsCancelling(confirmCancelId);
        setConfirmCancelId(null); // Close modal

        const result = await cancelWithdrawal(confirmCancelId);

        if (result.success) {
            fetchHistory();
            setExpandedId(null);
        } else {
            alert(result.message);
        }
        setIsCancelling(null);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved':
            case 'success':
                return { bg: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2, label: 'Berhasil' };
            case 'process':
                return { bg: 'bg-blue-50 text-blue-600', icon: TrendingUp, label: 'Diproses' };
            case 'pending':
                return { bg: 'bg-amber-50 text-amber-600', icon: Clock, label: 'Menunggu Approval' };
            case 'rejected':
                return { bg: 'bg-rose-50 text-rose-600', icon: XCircle, label: 'Ditolak' };
            default:
                return { bg: 'bg-slate-50 text-slate-600', icon: Clock, label: status };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
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
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Penarikan</h1>
                </div>
            </header>

            {/* Transaction List - Sharp & Clean */}
            <div className="px-5 mt-10">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-3">Riwayat Transaksi</h3>
                    {/* <button className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Lihat Semua</button> */}
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Memuat Data...</p>
                        </div>
                    ) : withdrawals.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Belum ada riwayat penarikan</p>
                        </div>
                    ) : (
                        withdrawals.map((wd, i) => {
                            const style = getStatusStyles(wd.status);
                            const StatusIcon = style.icon;

                            const isExpanded = expandedId === wd.id;

                            return (
                                <React.Fragment key={wd.id}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setExpandedId(isExpanded ? null : wd.id)}
                                        className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer ${isExpanded ? 'border-blue-200 shadow-lg' : 'border-slate-50 shadow-premium hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center`}>
                                                    <StatusIcon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 leading-none">Rp {Number(wd.amount).toLocaleString('id-ID')}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(wd.created_at)}</p>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <p className={`text-[9px] font-black uppercase tracking-widest ${style.bg.split(' ')[1]}`}>{style.label}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronRight size={16} className="text-slate-300" />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 mt-4 border-t border-slate-100">
                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1">Bank Tujuan</p>
                                                                <p className="text-xs font-black text-slate-900">{wd.bank_name}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">{wd.account_number}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">{wd.account_name}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1">ID Penarikan</p>
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <p className="text-[10px] font-black text-slate-900 font-mono">{wd.id}</p>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigator.clipboard.writeText(wd.id);
                                                                            setCopiedId(wd.id);
                                                                            setTimeout(() => setCopiedId(null), 2000);
                                                                        }}
                                                                        className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                                                                    >
                                                                        {copiedId === wd.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {wd.payments && wd.payments.length > 0 && (
                                                            <div>
                                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-2">Detail Transaksi</p>
                                                                <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                                                                    {wd.payments.map((payment: any) => (
                                                                        <div key={payment.id} className="flex justify-between items-center text-[10px]">
                                                                            <span className="text-slate-500 font-medium">#{payment.order_id}</span>
                                                                            <span className="font-bold text-slate-900">Rp {Number(payment.amount).toLocaleString('id-ID')}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {wd.status === 'pending' && (
                                                            <div className="mt-4 flex justify-end">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCancelClick(wd.id);
                                                                    }}
                                                                    disabled={isCancelling === wd.id}
                                                                    className="px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50"
                                                                >
                                                                    {isCancelling === wd.id ? 'Memproses...' : 'Batalkan Penarikan'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </React.Fragment>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            <AnimatePresence>
                {confirmCancelId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setConfirmCancelId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 mx-auto">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 text-center mb-2">Batalkan Penarikan?</h3>
                            <p className="text-xs text-slate-500 text-center font-medium leading-relaxed mb-6">
                                Tindakan ini tidak dapat dibatalkan. Penarikan akan dihapus secara permanen.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setConfirmCancelId(null)}
                                    className="py-3 rounded-xl bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                >
                                    Kembali
                                </button>
                                <button
                                    onClick={proceedCancel}
                                    className="py-3 rounded-xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                                >
                                    Ya, Batalkan
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation removed - handled globally */}
        </div>
    );
}
