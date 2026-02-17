
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('--- Debugging Balance Logic ---');

    // 1. Get all users with referral codes
    const users = await prisma.user.findMany({
        where: { referral_code: { not: null } },
        select: { email: true, referral_code: true }
    });

    console.log(`Found ${users.length} users with referral codes.`);

    for (const user of users) {
        console.log(`\nChecking user: ${user.email} (${user.referral_code})`);

        // 2. Check all payments for this referral code
        const payments = await prisma.payment.findMany({
            where: { referral_code: user.referral_code }
        });

        console.log(`Total payments found: ${payments.length}`);

        if (payments.length === 0) continue;

        // 3. Check 'success' payments
        const successPayments = payments.filter(p => p.status === 'success');
        console.log(`Success payments: ${successPayments.length}`);

        if (successPayments.length === 0) continue;

        // 4. Check First Payment Date (Logic replication)
        const sortedDetails = successPayments.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
        const firstPayment = sortedDetails[0];
        const startDate = new Date(firstPayment.created_at!);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3);

        console.log(`First Payment Date: ${startDate.toISOString()}`);
        console.log(`Window End Date: ${endDate.toISOString()}`);

        // 5. Check Eligible Payments
        const eligible = payments.filter(p => {
            const pDate = new Date(p.created_at!);
            const isSuccess = p.status === 'success';
            const isWindow = pDate >= startDate && pDate <= endDate;
            const noWithdraw = p.withdrawId === null;

            // Log rejection reason if not eligible
            if (!isSuccess) console.log(`- Payment ${p.id}: Rejected (Status: ${p.status})`);
            else if (!isWindow) console.log(`- Payment ${p.id}: Rejected (Date ${pDate.toISOString()} outside window)`);
            else if (!noWithdraw) console.log(`- Payment ${p.id}: Rejected (Already withdrawn, ID: ${p.withdrawId})`);

            return isSuccess && isWindow && noWithdraw;
        });

        const total = eligible.reduce((sum, p) => sum + Number(p.amount), 0);
        console.log(`Eligible Payments Count: ${eligible.length}`);
        console.log(`Calculated Balance: ${total}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
