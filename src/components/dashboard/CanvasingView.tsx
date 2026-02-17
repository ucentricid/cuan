'use client';

import React from 'react';

import { motion } from 'framer-motion';

export const CanvasingView: React.FC<{ data: any; paymentHistory?: any[] }> = ({ data, paymentHistory = [] }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="px-5 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-premium">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">Riwayat Penjualan</h3>
                    </div>

                    <div className="overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="text-left py-3 pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                                    <th className="text-left py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                                    <th className="text-right py-3 pr-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nominal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paymentHistory.length > 0 ? (
                                    paymentHistory.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 pl-4 text-xs font-medium text-slate-900">{item.orderId}</td>
                                            <td className="py-3 text-xs font-medium text-slate-500">{item.date}</td>
                                            <td className="py-3 pr-4 text-right">
                                                <span className="text-xs font-bold text-slate-900">
                                                    Rp {item.amount.toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-xs text-slate-400">
                                            Belum ada riwayat penjualan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
