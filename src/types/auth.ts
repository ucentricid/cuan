import { SalesRole } from '@/context/RoleContext';

export interface LoginResult {
    success: boolean;
    message?: string;
    user?: {
        email: string;
        role: SalesRole;
    };
}
