'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserStatus } from '@/app/actions/auth';

export type SalesRole = 'canvassing' | 'sales_afiliator' | 'host_live';

interface RoleContextType {
    role: SalesRole;
    userEmail: string | null;
    setRole: (role: SalesRole) => void;
    roleName: string;
    isLoggedIn: boolean;
    isActive: boolean;
    login: (role: SalesRole, email: string, active: boolean) => void;
    logout: () => void;
    checkStatus: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRoleState] = useState<SalesRole>('canvassing');
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const checkStatus = async () => {
        if (!isLoggedIn || !userEmail) return;
        const result = await getUserStatus(userEmail);
        if (result.success) {
            setIsActive(result.isActive);
            localStorage.setItem('cuan_isActive', result.isActive ? 'true' : 'false');
        }
    };

    useEffect(() => {
        const savedRole = localStorage.getItem('cuan_role') as SalesRole;
        const savedEmail = localStorage.getItem('cuan_email');
        const savedLogin = localStorage.getItem('cuan_isLoggedIn') === 'true';
        const savedActive = localStorage.getItem('cuan_isActive') === 'true';

        if (savedRole && ['canvassing', 'sales_afiliator', 'host_live'].includes(savedRole)) {
            setRoleState(savedRole);
        }
        if (savedLogin) setIsLoggedIn(true);
        if (savedEmail) setUserEmail(savedEmail);
        setIsActive(savedActive);
        setIsInitialized(true);
    }, []);

    // Re-validate status from database if logged in
    useEffect(() => {
        if (isLoggedIn && userEmail) {
            checkStatus();
            const interval = setInterval(checkStatus, 1000); // Check every 1s for bidirectional real-time
            return () => clearInterval(interval);
        }
    }, [isLoggedIn, userEmail]);

    const setRole = (newRole: SalesRole) => {
        setRoleState(newRole);
        localStorage.setItem('cuan_role', newRole);
    };

    const login = (userRole: SalesRole, email: string, active: boolean) => {
        setRole(userRole);
        setUserEmail(email);
        setIsLoggedIn(true);
        setIsActive(active);
        localStorage.setItem('cuan_isLoggedIn', 'true');
        localStorage.setItem('cuan_email', email);
        localStorage.setItem('cuan_isActive', active ? 'true' : 'false');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setIsActive(false);
        setUserEmail(null);
        localStorage.removeItem('cuan_isLoggedIn');
        localStorage.removeItem('cuan_isActive');
        localStorage.removeItem('cuan_email');
        localStorage.removeItem('cuan_role');
    };

    const roleNames = {
        canvassing: 'Canvasing',
        sales_afiliator: 'Sales Afiliator',
        host_live: 'Host Live',
    };

    // Prevent hydration mismatch by wait for initialization
    if (!isInitialized) return null;

    return (
        <RoleContext.Provider value={{
            role,
            userEmail,
            setRole,
            roleName: roleNames[role],
            isLoggedIn,
            isActive,
            login,
            logout,
            checkStatus
        }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};
