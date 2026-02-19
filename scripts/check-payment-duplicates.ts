import { prisma } from '@/lib/prisma';

async function main() {
    console.log('Checking for users with multiple payment accounts...');

    // Group by userId and count
    const duplicates = await prisma.paymentAccount.groupBy({
        by: ['userId'],
        _count: {
            id: true
        },
        having: {
            id: {
                _count: {
                    gt: 1
                }
            }
        }
    });

    if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} users with multiple payment accounts:`);
        for (const dup of duplicates) {
            const user = await prisma.user.findUnique({ where: { id: dup.userId } });
            console.log(`- User: ${user?.email} (${dup.userId}) has ${dup._count.id} accounts.`);

            // List accounts
            const accounts = await prisma.paymentAccount.findMany({ where: { userId: dup.userId } });
            accounts.forEach(acc => {
                console.log(`  * ID: ${acc.id}, Type: ${acc.type}, Created: ${acc.createdAt}`);
            });
        }
    } else {
        console.log('No users with multiple payment accounts found.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
