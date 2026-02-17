import React from 'react';

interface PeriodSelectorProps {
    selected: string;
    onChange: (period: string) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selected, onChange }) => {
    const periods = [
        { id: 'daily', label: 'Hari' },
        { id: 'weekly', label: 'Minggu' },
        { id: 'monthly', label: 'Bulan' },
    ];

    return (
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
            {periods.map((period) => (
                <button
                    key={period.id}
                    onClick={() => onChange(period.id)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${selected === period.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    {period.label}
                </button>
            ))}
        </div>
    );
};
