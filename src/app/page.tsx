'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  ArrowUpRight,
  MoreVertical,
  TrendingUp,
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
import { PeriodSelector } from '@/components/ui/PeriodSelector';
import { CanvasingView } from '@/components/dashboard/CanvasingView';
import { AfiliatorView } from '@/components/dashboard/AfiliatorView';
import { HostLiveView } from '@/components/dashboard/HostLiveView';
import { useRole } from '@/context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getReferralCode } from '@/app/actions/referral';
import { getPaymentHistory, PaymentHistoryItem } from '@/app/actions/payment-history';
import { getWithdrawableBalance, createWithdrawal } from '@/app/actions/withdraw';

export default function Dashboard() {
  const [period, setPeriod] = useState('daily');
  const { role, roleName, isLoggedIn, isActive, logout, checkStatus, userEmail } = useRole();
  const router = useRouter();
  const [referralUrl, setReferralUrl] = useState<string>('');
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (userEmail) {
      getReferralCode(userEmail).then(result => {
        if (result.success && result.referralUrl) {
          setReferralUrl(result.referralUrl);
        }
      });

      getPaymentHistory(userEmail).then(result => {
        if (result.success && result.data) {
          setPaymentHistory(result.data);
        }
      });
    }
  }, [userEmail]);

  const handleCopyReferral = async () => {
    if (referralUrl) {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate Balance using server action to ensure correct withdrawal state
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (userEmail) {
      getWithdrawableBalance(userEmail).then(res => {
        if (res.success && typeof res.balance === 'number') {
          setBalance(res.balance);
        }
      });
    }
  }, [userEmail, paymentHistory]);

  if (!isLoggedIn) return null;

  const data = {
    total: balance, // Use calculated balance
    canvassing: period === 'daily' ? 5200000 : period === 'weekly' ? 38000000 : 152000000,
    sales_afiliator: period === 'daily' ? 4220000 : period === 'weekly' ? 32500000 : 138000000,
    host_live: period === 'daily' ? 6000000 : period === 'weekly' ? 34000000 : 135000000,
    growth: 12.5
  };

  const renderView = () => {
    switch (role) {
      case 'canvassing': return <CanvasingView data={data} paymentHistory={paymentHistory} />;
      case 'sales_afiliator': return <AfiliatorView data={data} paymentHistory={paymentHistory} />;
      case 'host_live': return <HostLiveView data={data} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pb-48">
      {/* Header */}
      <header className="p-5 pb-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <h2 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Live Reports</h2>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{roleName}</h1>
        </div>
      </header>

      {/* Inactive Notice View */}
      {!isActive ? (
        <div className="flex-1 flex flex-col justify-center px-5 py-10 min-h-[50vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/10 rounded-[32px] p-8 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search size={24} className="text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-white mb-3 tracking-tight">Akun Belum Aktif</h3>
            <p className="text-slate-400 text-sm leading-relaxed px-2 mb-8">
              Mohon menunggu persetujuan dari tim kami. Akun Anda saat ini sedang dalam tahap peninjauan.
            </p>

            <button
              onClick={async () => {
                const btn = document.getElementById('check-status-btn');
                if (btn) btn.innerText = 'Mengecek...';
                await checkStatus();
                if (btn) btn.innerText = 'Cek Status Sekarang';
              }}
              id="check-status-btn"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              Cek Status Sekarang
            </button>
          </motion.div>

          <div className="mt-10 text-center">
            <button
              onClick={() => router.push('/profile')}
              className="text-slate-400 text-xs font-bold border-b border-transparent hover:border-slate-400 transition-all pb-0.5"
            >
              Lihat Profile atau Keluar
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Income Summary Card */}
          <section className="px-5 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl shadow-slate-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 opacity-20 blur-[60px] -mr-24 -mt-24"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Saldo Saat Ini</p>
                    <h2 className="text-2xl font-black tracking-tight">
                      <span className="text-base font-bold text-slate-500 mr-1.5">Rp</span>
                      {data.total.toLocaleString('id-ID')}
                    </h2>
                  </div>
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <CreditCard size={20} className="text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2.5">
                    <button
                      onClick={async () => {
                        if (balance <= 0) {
                          alert('Saldo Anda kosong atau belum memenuhi syarat penarikan.');
                          return;
                        }
                        if (confirm(`Apakah Anda yakin ingin menarik dana sebesar Rp ${balance.toLocaleString('id-ID')}?`)) {
                          // Example bank details - in real app would come from modal/user profile
                          const result = await createWithdrawal(userEmail || '', {
                            bankName: 'BCA',
                            accountNumber: '1234567890',
                            accountName: 'User Account'
                          });

                          if (result.success) {
                            alert('Permintaan penarikan berhasil dibuat!');
                            setBalance(0); // Optimistic update
                            // Re-fetch history?
                          } else {
                            alert('Gagal: ' + result.message);
                          }
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                      Tarik Dana <ArrowUpRight size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Kenaikan</p>
                    <div className="text-emerald-400 text-xs font-black flex items-center gap-0.5 justify-end">
                      <TrendingUp size={14} />
                      +{data.growth}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>



          {/* Referral Code Section */}
          {referralUrl && (
            <section className="px-5 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-[24px] border border-blue-100 shadow-premium">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">Link Referral Anda</h3>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-slate-600 truncate flex-1">{referralUrl}</p>
                  <button
                    onClick={handleCopyReferral}
                    className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 ${copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Dynamic Role Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-[400px]" /* Stable min-height to prevent jumps */
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Bottom Navigation removed - handled globally */}
    </div>
  );
}
