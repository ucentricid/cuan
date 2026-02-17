'use client';

import React from 'react';
import { Tv, Flame, Heart, Video, Play, Calendar, Zap } from 'lucide-react';
import { RevenueCard } from '@/components/ui/RevenueCard';
import { ChartSection } from '@/components/ui/ChartSection';
import { motion } from 'framer-motion';

export const HostLiveView: React.FC<{ data: any }> = ({ data }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="px-5 flex flex-col gap-4">
                <RevenueCard
                    title="Gift & Penjualan"
                    amount={data.host_live}
                    growth={-2.4}
                    icon={Tv}
                    color="bg-rose-600"
                />

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-premium">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3">
                            <Flame size={20} />
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Viewers</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">4.2K</p>
                    </div>
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-premium">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3">
                            <Heart size={20} />
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Likes Today</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">28.5K</p>
                    </div>
                </div>
            </div>

            <div className="px-5">
                <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600 opacity-20 blur-[30px] -mr-12 -mt-12 group-hover:opacity-40 transition-opacity"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Video size={18} className="text-rose-400" />
                                </div>
                                <h4 className="font-black text-xs uppercase tracking-wider">Sesi Mendatang</h4>
                            </div>
                            <div className="flex items-center gap-1.5 bg-rose-500/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border border-rose-500/20">
                                <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse"></div>
                                Live Soon
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-5">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Waktu Mulai</span>
                                <span className="text-[9px] font-black text-rose-400 italic">10 Menit Lagi</span>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-relaxed font-semibold flex items-center gap-1.5">
                                <Calendar size={12} className="text-slate-500" /> Hari ini, 19:00 WIB
                            </p>
                        </div>

                        <button className="w-full bg-white text-rose-600 py-3 rounded-xl font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2.5">
                            <Play size={16} fill="currentColor" /> Persiapkan Studio
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-5 flex flex-col gap-4">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] ml-1">Live Analytics</h3>
                <ChartSection />
            </div>
        </div>
    );
};
