'use server';

import { prisma } from '@/lib/prisma';
import { SalesRole } from '@/context/RoleContext';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export async function loginUser(email: string, password: string, role: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                role: role,
            },
        });

        if (user && user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return {
                    success: true,
                    user: {
                        email: user.email || '',
                        role: (user.role as SalesRole) || 'canvassing',
                        isActive: (user as any).status ?? false
                    }
                };
            }
        }

        return { success: false, message: 'Email, password, atau peran tidak sesuai.' };
    } catch (error: any) {
        console.error('Login error:', error);
        return { success: false, message: 'Terjadi kesalahan pada server.' };
    }
}

export async function getUserStatus(email: string) {
    if (!email) return { success: false, isActive: false };

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        });

        let isActive = (user as any)?.status ?? false;

        // Raw SQL verification (Source of Truth)
        try {
            const rawResult: any[] = await (prisma as any).$queryRaw`SELECT status FROM "User" WHERE email = ${email} LIMIT 1`;
            if (rawResult && rawResult.length > 0) {
                // Important: raw PostgreSQL boolean might come back as boolean or 1/0
                isActive = !!rawResult[0].status;
                console.log(`[StatusCheck] Confirmed via RAW SQL: ${isActive}`);
            }
        } catch (rawErr) {
            console.error('[StatusCheck] RAW SQL Error:', rawErr);
        }

        console.log(`[StatusCheck] Final Status returned: ${isActive}`);

        return { success: true, isActive };
    } catch (error) {
        console.error('getUserStatus error:', error);
        return { success: false, isActive: false };
    }
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();
}

function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function registerUser(email: string, password: string, role: SalesRole, name: string) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { success: false, message: 'Email sudah terdaftar.' };
        }

        // Dynamic Referral Code logic
        const prefix = role === 'canvassing' ? 'C' : role === 'sales_afiliator' ? 'S' : 'H';
        const initials = getInitials(name);
        const dateStr = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, ''); // DDMMYYYY

        const randomSuffix = generateRandomString(5);
        const raffCode = `${prefix}${initials}${dateStr}${randomSuffix}`;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                id: uuidv4(),
                email: email,
                password: hashedPassword,
                role: role,
                name: name,
                referral_code: raffCode,
                status: false, // Explicitly set to false (also default in schema)
            }
        });

        return {
            success: true,
            user: {
                email: newUser.email || '',
                role: (newUser.role as SalesRole) || 'canvassing',
                isActive: (newUser as any).status ?? false
            }
        };
    } catch (error: any) {
        console.error('Registration error:', error);
        return { success: false, message: 'Gagal membuat akun. Silakan coba lagi.' };
    }
}
