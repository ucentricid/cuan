'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle2, ArrowUpRight, Loader2, Wallet } from 'lucide-react';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    balance: number;
    bankDetails?: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    balance,
    bankDetails
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setStatus('IDLE');
        try {
            await onConfirm();
            setStatus('SUCCESS');
            // Auto close after success? Or let user close.
            // Let's keep it open to show success state.
        } catch (error: any) {
            setStatus('ERROR');
            setErrorMessage(error.message || 'Terjadi kesalahan saat memproses penarikan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetState = () => {
        setStatus('IDLE');
        setErrorMessage('');
        setIsSubmitting(false);
    }

    const handleClose = () => {
        if (status === 'SUCCESS') {
            // If success, we might want to trigger a refresh or something up stream, 
            // but onConfirm usually handles data updates.
            // We just close.
        }
        resetState();
        onClose();
    }

    // Content for Low Balance
    const renderLowBalance = () => (
        <div className="text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-amber-100/50 relative">
                <div className="absolute inset-0 bg-amber-200/20 blur-xl rounded-full scale-75 animate-pulse"></div>
                <AlertCircle size={32} className="text-amber-500 relative z-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Saldo Tidak Cukup</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 px-4">
                Saldo Anda saat ini <span className="text-slate-900 font-bold">Rp {balance.toLocaleString('id-ID')}</span>.
                <br />
                Minimal penarikan adalah Rp 10.000. Silahkan kumpulkan lebih banyak komisi!
            </p>
            <button
                onClick={handleClose}
                className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 py-4 rounded-2xl font-black text-xs transition-all"
            >
                Saya Mengerti
            </button>
        </div>
    );

    // Content for Confirmation
    const renderConfirmation = () => (
        <div className="text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-blue-100/50 relative">
                <div className="absolute inset-0 bg-blue-200/20 blur-xl rounded-full scale-75 animate-pulse"></div>
                <Wallet size={32} className="text-blue-600 relative z-10" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Konfirmasi Penarikan</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                Anda akan menarik dana sebesar:
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                    <span className="text-sm font-bold text-slate-400 mr-1">Rp</span>
                    {balance.toLocaleString('id-ID')}
                </div>
            </div>

            {bankDetails && (
                <div className="text-left bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Bank Tujuan</span>
                        <span className="text-xs font-bold text-slate-700">{bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">No. Rekening</span>
                        <span className="text-xs font-bold text-slate-700">{bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Nama Pemilik</span>
                        <span className="text-xs font-bold text-slate-700">{bankDetails.accountName}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col w-full gap-3">
                <button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-600/20 active:scale-95 transition-all hover:bg-blue-500 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" /> Memproses...
                        </>
                    ) : (
                        <>
                            Ya, Tarik Sekarang <ArrowUpRight size={16} />
                        </>
                    )}
                </button>
                <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="w-full bg-white text-slate-400 py-4 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all border border-transparent"
                >
                    Batalkan
                </button>
            </div>
        </div>
    );

    // Content for Success
    const renderSuccess = () => (
        <div className="text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-emerald-100/50 relative">
                <div className="absolute inset-0 bg-emerald-200/20 blur-xl rounded-full scale-75 animate-bounce"></div>
                <CheckCircle2 size={32} className="text-emerald-500 relative z-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Penarikan Berhasil!</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                Permintaan penarikan dana Anda telah berhasil dibuat. Mohon tunggu proses transfer maksimal 1x24 jam.
            </p>
            <button
                onClick={handleClose}
                className="w-full bg-emerald-500 text-white hover:bg-emerald-400 py-4 rounded-2xl font-black text-xs shadow-xl shadow-emerald-500/20 transition-all"
            >
                Selesai
            </button>
        </div>
    );

    // Content for Error
    const renderError = () => (
        <div className="text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-rose-100/50 relative">
                <div className="absolute inset-0 bg-rose-200/20 blur-xl rounded-full scale-75 animate-pulse"></div>
                <AlertCircle size={32} className="text-rose-500 relative z-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Gagal Menarik Dana</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 px-4">
                {errorMessage}
            </p>
            <div className="flex flex-col w-full gap-3">
                <button
                    onClick={handleConfirm} // Retry
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800"
                >
                    Coba Lagi
                </button>
                <button
                    onClick={handleClose}
                    className="w-full bg-white text-slate-400 py-4 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all border border-transparent"
                >
                    Tutup
                </button>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isSubmitting ? handleClose : undefined}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-[360px] bg-white rounded-[32px] overflow-hidden z-[101] shadow-2xl"
                    >
                        {/* Add a close button wrapper only if not success/loading, logic inside render blocks can handle local buttons */}
                        {(status !== 'SUCCESS' && !isSubmitting && status !== 'ERROR') && (
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-20"
                            >
                                <X size={20} />
                            </button>
                        )}


                        <div className="relative p-8 pt-10">
                            {/* Logic to render content based on state */}
                            {balance <= 0 && status === 'IDLE' ? renderLowBalance() :
                                status === 'SUCCESS' ? renderSuccess() :
                                    status === 'ERROR' ? renderError() :
                                        renderConfirmation()}

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
