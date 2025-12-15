'use client'
import { useAuth } from "@/app/_lib/authcontext";
import { useLayoutEffect } from "react";
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

function Protected({ children }) {
    const { user, loading } = useAuth();
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        if (!loading && !user) {
            redirect(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, [user, loading, returnUrl]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Sprawdzanie uprawnień...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}

export default Protected;