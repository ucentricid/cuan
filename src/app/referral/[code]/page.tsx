
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    // Set cookie for 30 days
    const cookieStore = await cookies();
    cookieStore.set('referral_code', code, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
    });

    redirect('/register');
}
