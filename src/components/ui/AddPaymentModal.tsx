'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Wallet, Check, ChevronDown } from 'lucide-react';

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => Promise<void>;
    editingAccount?: any;
    accountType?: 'BANK' | 'E-WALLET' | null;
}

const BANK_OPTIONS = [
    'BCA', 'Mandiri', 'BNI', 'BRI', 'BSI', 'CIMB Niaga', 'Permata', 'Danamon'
];

const EWALLET_OPTIONS = [
    'GoPay', 'OVO', 'DANA', 'LinkAja', 'ShopeePay'
];

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
    isOpen,
    onClose,
    onAdd,
    editingAccount,
    accountType
}) => {
    const [type, setType] = useState<'BANK' | 'E-WALLET'>(accountType || 'BANK');
    const [providerName, setProviderName] = useState(BANK_OPTIONS[0]);
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill form when editing
    useEffect(() => {
        if (editingAccount) {
            setType(editingAccount.type);
            setProviderName(editingAccount.providerName);
            setAccountNumber(editingAccount.accountNumber);
            setAccountName(editingAccount.accountName);
        } else if (accountType) {
            setType(accountType);
            setProviderName(accountType === 'BANK' ? BANK_OPTIONS[0] : EWALLET_OPTIONS[0]);
            setAccountNumber('');
            setAccountName('');
        }
    }, [editingAccount, accountType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onAdd({
                type,
                providerName,
                accountNumber,
                accountName
            });
            // Reset form
            setAccountNumber('');
            setAccountName('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEditing = !!editingAccount;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end justify-center"
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[40px] z-[101] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 pt-6 pb-24">
                            {/* Handle */}
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>

                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    {isEditing ? 'Edit Rekening' : 'Tambah Rekening'}
                                </h3>
                                <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Type Selector */}
                                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => { setType('BANK'); setProviderName(BANK_OPTIONS[0]); }}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'BANK' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                    >
                                        <Building2 size={16} /> Bank
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setType('E-WALLET'); setProviderName(EWALLET_OPTIONS[0]); }}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'E-WALLET' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                    >
                                        <Wallet size={16} /> E-Wallet
                                    </button>
                                </div>

                                {/* Provider Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Provider</label>
                                    <div className="relative">
                                        <select
                                            value={providerName}
                                            onChange={(e) => setProviderName(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                                        >
                                            {(type === 'BANK' ? BANK_OPTIONS : EWALLET_OPTIONS).map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Account Number */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Nomor {type === 'BANK' ? 'Rekening' : 'Phone / ID'}
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder={`Masukkan nomor ${type === 'BANK' ? 'rekening' : 'e-wallet'}...`}
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-300"
                                    />
                                </div>

                                {/* Account Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Pemilik</label>
                                    <input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Nama sesuai rekening..."
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-300"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? 'Memproses...' : (
                                        <>
                                            <Check size={18} /> {isEditing ? 'Update Rekening' : 'Simpan Rekening'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
