import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { upsertPaymentAccount } from '../src/app/actions/payment';
import { v4 as uuidv4 } from 'uuid';

// Mock next/cache
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

describe('Payment Fix Verification', () => {
    let userId: string;

    afterAll(async () => {
        if (userId) {
            await prisma.user.delete({ where: { id: userId } }).catch(() => { });
        }
        await prisma.$disconnect();
    });

    test('upsertPaymentAccount removes duplicates and updates correctly', async () => {
        // 1. Create a test user
        const email = `test.payment.verify.${Date.now()}@example.com`;
        const user = await prisma.user.create({
            data: {
                id: uuidv4(),
                email,
                name: 'Test Payment Verify',
                password: 'hashed_password', // Dummy
            }
        });
        userId = user.id;
        console.log(`Created test user: ${user.id}`);

        // 2. Manually insert 2 duplicate accounts
        await prisma.paymentAccount.createMany({
            data: [
                {
                    id: uuidv4(),
                    userId: user.id,
                    type: 'BANK',
                    providerName: 'BCA',
                    accountNumber: '111111',
                    accountName: 'Test Account 1',
                    updatedAt: new Date(Date.now() - 10000) // Older
                },
                {
                    id: uuidv4(),
                    userId: user.id,
                    type: 'E-WALLET',
                    providerName: 'GOPAY',
                    accountNumber: '222222',
                    accountName: 'Test Account 2',
                    updatedAt: new Date() // Newer
                }
            ]
        });
        console.log('Inserted 2 duplicate accounts.');

        // Verify duplicates exist
        const initialAccounts = await prisma.paymentAccount.findMany({ where: { userId: user.id } });
        expect(initialAccounts.length).toBe(2);

        // 3. Call upsertPaymentAccount (should clean up)
        console.log('Calling upsertPaymentAccount...');
        const result = await upsertPaymentAccount(email, {
            type: 'BANK',
            providerName: 'MANDIRI',
            accountNumber: '333333',
            accountName: 'Updated Account'
        });

        expect(result.success).toBe(true);

        // 4. Verify only 1 account remains and is correct
        const finalAccounts = await prisma.paymentAccount.findMany({ where: { userId: user.id } });
        expect(finalAccounts.length).toBe(1);

        const account = finalAccounts[0];
        expect(account.type).toBe('BANK');
        expect(account.providerName).toBe('MANDIRI');
        expect(account.accountNumber).toBe('333333');

        console.log('VERIFICATION SUCCESS: Account updated and duplicates removed.');
    }, 30000); // 30s timeout
});
