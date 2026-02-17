import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface RevenueCardProps {
    title: string;
    amount: number;
    growth: number;
    icon: LucideIcon;
    color: string;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({ title, amount, growth, icon: Icon, color }) => {
    const isPositive = growth >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-premium flex flex-col gap-3 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-3 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity">
                <Icon size={64} />
            </div>

            <div className="flex justify-between items-center relative z-10">
                <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
                    <Icon size={18} strokeWidth={2.5} />
                </div>
                <div className={`px-1.5 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(growth)}%
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{title}</p>
                <h3 className="text-lg font-black mt-0.5 text-slate-900 tracking-tight">
                    Rp {amount.toLocaleString('id-ID')}
                </h3>
            </div>
        </motion.div>
    );
};
