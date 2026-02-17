'use server';

import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function upsertPaymentAccount(email: string, data: {
    type: 'BANK' | 'E-WALLET';
    providerName: string;
    accountNumber: string;
    accountName: string;
}) {
    console.log(`[Payment] upsertPaymentAccount attempt for email: ${email}, type: ${data.type}`);
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        });

        if (!user) {
            console.error(`[Payment] User NOT FOUND for email: ${email}`);
            return { success: false, message: 'User tidak ditemukan.' };
        }

        console.log(`[Payment] Found user ID: ${user.id}, proceeding to upsert account`);

        // First, get existing account (any type)
        const existingAccount = await prisma.paymentAccount.findFirst({
            where: { userId: user.id }
        });

        let account;

        if (existingAccount) {
            // Update existing account (can change type)
            account = await prisma.paymentAccount.update({
                where: { id: existingAccount.id },
                data: {
                    type: data.type,
                    providerName: data.providerName,
                    accountNumber: data.accountNumber,
                    accountName: data.accountName,
                }
            });
            console.log(`[Payment] Updated existing account ${account.id}, type changed from ${existingAccount.type} to ${data.type}`);
        } else {
            // Create new account
            account = await prisma.paymentAccount.create({
                data: {
                    id: uuidv4(),
                    userId: user.id,
                    type: data.type,
                    providerName: data.providerName,
                    accountNumber: data.accountNumber,
                    accountName: data.accountName,
                }
            });
            console.log(`[Payment] Created new account: ${account.id}`);
        }

        return { success: true, account };
    } catch (error: any) {
        console.error('[Payment] upsertPaymentAccount error:', error);
        return { success: false, message: `Gagal menyimpan rekening: ${error.message || 'Error Unknown'}` };
    }
}

export async function getPaymentAccounts(email: string) {
    console.log(`[Payment] getPaymentAccounts attempt for email: ${email}`);
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        });

        if (!user) {
            console.error(`[Payment] getPaymentAccounts: User NOT FOUND for email: ${email}`);
            return { success: false, message: 'User tidak ditemukan.' };
        }

        // Get the single payment account (if exists)
        const account = await prisma.paymentAccount.findFirst({
            where: { userId: user.id }
        });

        console.log(`[Payment] Found account: ${account ? 'yes' : 'no'} for user ${user.id}`);
        return {
            success: true,
            account: account || null
        };
    } catch (error: any) {
        console.error('[Payment] getPaymentAccounts error:', error);
        return { success: false, message: `Gagal mengambil data rekening: ${error.message || 'Error Unknown'}` };
    }
}
