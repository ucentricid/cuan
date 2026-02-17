'use server';

import { prisma } from '@/lib/prisma';

export async function cleanupDuplicateAccounts() {
    console.log('[Cleanup] Starting duplicate payment account cleanup...');

    try {
        // Get all payment accounts grouped by userId
        const allAccounts = await prisma.paymentAccount.findMany({
            orderBy: { updatedAt: 'desc' }
        });

        // Group by userId
        const grouped = allAccounts.reduce((acc, account) => {
            if (!acc[account.userId]) {
                acc[account.userId] = [];
            }
            acc[account.userId].push(account);
            return acc;
        }, {} as Record<string, any[]>);

        let deletedCount = 0;

        // For each user with multiple accounts, keep only the most recent
        for (const [userId, accounts] of Object.entries(grouped)) {
            if (accounts.length > 1) {
                console.log(`[Cleanup] User ${userId} has ${accounts.length} accounts`);

                // Keep the first one (most recent), delete the rest
                const toDelete = accounts.slice(1);

                for (const account of toDelete) {
                    console.log(`[Cleanup] Deleting ${account.type} - ${account.providerName}`);
                    await prisma.paymentAccount.delete({
                        where: { id: account.id }
                    });
                    deletedCount++;
                }
            }
        }

        console.log(`[Cleanup] Deleted ${deletedCount} duplicate accounts`);
        return { success: true, deletedCount };
    } catch (error: any) {
        console.error('[Cleanup] Error:', error);
        return { success: false, message: error.message };
    }
}
