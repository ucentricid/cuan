'use server';

import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

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

        // Get ALL existing accounts to handle potential duplicates
        const existingAccounts = await prisma.paymentAccount.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' } // Most recent first
        });

        let account;

        if (existingAccounts.length > 0) {
            // Keep the most recent one
            const accountToUpdate = existingAccounts[0];

            // Delete any extras (duplicates)
            if (existingAccounts.length > 1) {
                const idsToDelete = existingAccounts.slice(1).map(acc => acc.id);
                await prisma.paymentAccount.deleteMany({
                    where: { id: { in: idsToDelete } }
                });
                console.log(`[Payment] Cleaned up ${idsToDelete.length} duplicate accounts for user ${user.id}`);
            }

            // Update the kept account
            account = await prisma.paymentAccount.update({
                where: { id: accountToUpdate.id },
                data: {
                    type: data.type,
                    providerName: data.providerName,
                    accountNumber: data.accountNumber,
                    accountName: data.accountName,
                }
            });
            console.log(`[Payment] Updated account ${account.id}`);
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

        // Revalidate the profile page to ensure fresh data
        revalidatePath('/profile');

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
