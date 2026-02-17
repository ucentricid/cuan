'use server';

import { prisma } from '@/lib/prisma';

export async function getReferralCode(email: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            select: {
                referral_code: true
            }
        });

        if (!user || !user.referral_code) {
            return { success: false, message: 'Referral code tidak ditemukan.' };
        }

        return {
            success: true,
            referralCode: user.referral_code,
            referralUrl: `http://payment-page.103.127.139.112.sslip.io/referral/${user.referral_code}`
        };
    } catch (error: any) {
        console.error('[Referral] getReferralCode error:', error);
        return { success: false, message: `Gagal mengambil referral code: ${error.message}` };
    }
}
