'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-[360px] bg-white rounded-[32px] overflow-hidden z-[101] shadow-2xl"
                    >
                        <div className="relative p-8 flex flex-col items-center text-center">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Icon Wrapper */}
                            <div className="w-20 h-20 bg-rose-50 rounded-[24px] flex items-center justify-center mb-6 border border-rose-100/50 relative">
                                <div className="absolute inset-0 bg-rose-200/20 blur-xl rounded-full scale-75 animate-pulse"></div>
                                <LogOut size={32} className="text-rose-600 relative z-10" />
                            </div>

                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Konfirmasi Keluar</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                                Apakah Anda yakin ingin mengakhiri sesi terminal dan keluar dari akun?
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={onConfirm}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/20 active:scale-95 transition-all hover:bg-slate-800"
                                >
                                    Ya, Keluar Akun
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-white text-slate-400 py-4 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all border border-transparent"
                                >
                                    Batalkan
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
