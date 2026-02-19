'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export type BankDetails = {
    bankName: string;
    accountNumber: string;
    accountName: string;
};

// Get balance available for withdrawal (payments not yet withdrawn)
export async function getWithdrawableBalance(email: string) {
    try {
        if (!email) return { success: false, message: 'Email required' };

        const user = await prisma.user.findUnique({
            where: { email },
            select: { referral_code: true }
        });

        if (!user || !user.referral_code) {
            return { success: false, message: 'User or referral code not found' };
        }

        // Calculate 3-month window logic
        // 1. Find first success payment ever
        const firstPayment = await prisma.payment.findFirst({
            where: {
                referral_code: user.referral_code,
                status: 'success'
            },
            orderBy: { created_at: 'asc' }
        });

        if (!firstPayment || !firstPayment.created_at) {
            return { success: true, balance: 0, paymentIds: [] };
        }

        const startDate = new Date(firstPayment.created_at);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3);

        // 2. Find eligible payments:
        // - Matching referral code
        // - Status success
        // - Within 3-month window
        // - withdrawId is NULL (Has not been withdrawn yet)
        const eligiblePayments = await prisma.payment.findMany({
            where: {
                referral_code: user.referral_code,
                status: 'success',
                withdrawId: null,
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        const totalBalance = eligiblePayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const paymentIds = eligiblePayments.map(p => p.id); // Assuming p.id is Int based on schema, but mapped to String in other places? Schema says Int.

        return {
            success: true,
            balance: totalBalance,
            paymentIds: paymentIds
        };

    } catch (error) {
        console.error('getWithdrawableBalance error:', error);
        return { success: false, message: 'Failed to calculate balance' };
    }
}

// Create Withdrawal Request
export async function createWithdrawal(email: string, bankDetails: BankDetails) {
    try {
        // 1. Check Balance & Eligible Payments
        const balanceResult = await getWithdrawableBalance(email);
        if (!balanceResult.success || typeof balanceResult.balance !== 'number') {
            return { success: false, message: balanceResult.message || 'Failed to check balance' };
        }

        if (balanceResult.balance <= 0) {
            return { success: false, message: 'Saldo tidak mencukupi untuk penarikan' };
        }

        const paymentIds = balanceResult.paymentIds || [];

        // 2. Perform Transaction
        const result = await prisma.$transaction(async (tx) => {
            // A. Create Withdraw Record
            const withdrawal = await tx.withdraw.create({
                data: {
                    amount: balanceResult.balance,
                    user_email: email,
                    bank_name: bankDetails.bankName,
                    account_number: bankDetails.accountNumber,
                    account_name: bankDetails.accountName,
                    status: 'pending'
                }
            });

            // B. Update Payments with withdrawId
            // Note: paymentIds is array of Int (from schema), updateMany with 'in'
            await tx.payment.updateMany({
                where: {
                    id: { in: paymentIds }
                },
                data: {
                    withdrawId: withdrawal.id
                }
            });

            return withdrawal;
        });

        return { success: true, data: result };

    } catch (error) {
        console.error('createWithdrawal error:', error);
        return { success: false, message: 'Gagal memproses penarikan' };
    }
}

export async function getWithdrawals(email: string) {
    try {
        if (!email) return { success: false, message: 'Email required' };

        const withdrawals = await prisma.withdraw.findMany({
            where: { user_email: email },
            orderBy: { created_at: 'desc' },
            include: { payments: true }
        });

        // Convert Decimal to string/number for client component compatibility
        const serializedWithdrawals = withdrawals.map(wd => ({
            ...wd,
            payments: wd.payments.map(p => ({
                ...p,
                amount: p.amount.toString() // Convert Decimal to string
            }))
        }));

        return { success: true, data: serializedWithdrawals };
    } catch (error) {
        console.error('getWithdrawals error:', error);
        return { success: false, message: 'Gagal mengambil riwayat penarikan' };
    }
}

export async function cancelWithdrawal(id: string) {
    try {
        const withdrawal = await prisma.withdraw.findUnique({
            where: { id }
        });

        if (!withdrawal) {
            return { success: false, message: 'Penarikan tidak ditemukan' };
        }

        if (withdrawal.status !== 'pending') {
            return { success: false, message: 'Hanya penarikan pending yang dapat dibatalkan' };
        }

        await prisma.withdraw.delete({
            where: { id }
        });

        revalidatePath('/dompet');
        return { success: true, message: 'Permintaan penarikan dibatalkan' };
    } catch (error) {
        console.error('cancelWithdrawal error:', error);
        return { success: false, message: 'Gagal membatalkan penarikan' };
    }
}
