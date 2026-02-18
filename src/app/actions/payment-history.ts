'use server';

import { prisma } from '@/lib/prisma';

export type PaymentHistoryItem = {
    id: string;
    orderId: string;
    amount: number;
    date: string;
    status: string;
    createdAt: Date;
};

export async function getPaymentHistory(email: string): Promise<{ success: boolean; data?: PaymentHistoryItem[]; message?: string }> {
    try {
        if (!email) {
            return { success: false, message: 'Email required' };
        }

        // 1. Get User's Referral Code
        const user = await prisma.user.findUnique({
            where: { email },
            select: { referral_code: true }
        });

        if (!user || !user.referral_code) {
            return { success: false, message: 'User or referral code not found' };
        }

        // 2. Query Payments
        const payments = await prisma.payment.findMany({
            where: {
                referral_code: user.referral_code,
                status: 'success'
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 10
        });

        // 3. Format Data
        const formattedData: PaymentHistoryItem[] = payments.map(p => ({
            id: p.id.toString(),
            orderId: p.order_id,
            amount: Number(p.amount),
            date: (p.created_at || new Date()).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }),
            status: p.status || 'pending',
            createdAt: p.created_at || new Date()
        }));

        return {
            success: true,
            data: formattedData
        };

    } catch (error) {
        console.error('getPaymentHistory error:', error);
        return { success: false, message: 'Failed to fetch payment history' };
    }
}
