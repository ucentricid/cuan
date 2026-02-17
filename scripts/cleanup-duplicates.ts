import { prisma } from '../src/lib/prisma';

async function cleanupDuplicates() {
    console.log('Starting cleanup of duplicate payment accounts...');

    // Find all users with multiple payment accounts
    const duplicates = await prisma.$queryRaw`
    SELECT "userId", COUNT(*) as count
    FROM "PaymentAccount"
    GROUP BY "userId"
    HAVING COUNT(*) > 1
  `;

    console.log(`Found ${(duplicates as any[]).length} users with duplicate accounts`);

    for (const dup of duplicates as any[]) {
        console.log(`Processing user ${dup.userId} with ${dup.count} accounts...`);

        // Get all accounts for this user, ordered by most recent first
        const accounts = await prisma.paymentAccount.findMany({
            where: { userId: dup.userId },
            orderBy: { updatedAt: 'desc' }
        });

        // Keep the most recent one, delete the rest
        const toKeep = accounts[0];
        const toDelete = accounts.slice(1);

        console.log(`  Keeping: ${toKeep.type} - ${toKeep.providerName}`);

        for (const account of toDelete) {
            console.log(`  Deleting: ${account.type} - ${account.providerName}`);
            await prisma.paymentAccount.delete({
                where: { id: account.id }
            });
        }
    }

    console.log('Cleanup complete!');
    await prisma.$disconnect();
}

cleanupDuplicates().catch(console.error);
