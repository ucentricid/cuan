import React from 'react';
import { motion } from 'framer-motion';

export const ChartSection: React.FC = () => {
    const bars = [40, 70, 45, 90, 65, 80, 55, 75, 40, 85, 60, 50];

    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-premium">
            <div className="flex justify-between items-center mb-5">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Pencapaian Mingguan</h4>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-100"></div>
                </div>
            </div>

            <div className="flex justify-between items-end h-28 gap-1.5 px-0.5">
                {bars.map((height, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${height}%`, opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
                        className={`flex-1 rounded-full ${i === bars.length - 2 ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-100'
                            }`}
                    />
                ))}
            </div>

            <div className="flex justify-between mt-5 px-0.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                <span>s</span>
                <span>s</span>
                <span>r</span>
                <span>k</span>
                <span>j</span>
                <span>s</span>
                <span>m</span>
            </div>
        </div>
    );
};
