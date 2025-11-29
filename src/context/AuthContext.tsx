import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSessionExpiry = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const now = new Date();
                const today7AM = new Date(now);
                today7AM.setHours(7, 0, 0, 0);

                // Get last active timestamp from local storage
                const lastActiveStr = localStorage.getItem('lastActiveTimestamp');

                if (lastActiveStr) {
                    const lastActive = new Date(lastActiveStr);

                    // If current time is past 7 AM today
                    if (now >= today7AM) {
                        // If last active was before today's 7 AM, force logout
                        if (lastActive < today7AM) {
                            await supabase.auth.signOut();
                            setSession(null);
                            setUser(null);
                            setLoading(false);
                            localStorage.setItem('lastActiveTimestamp', now.toISOString());
                            return;
                        }
                    }
                }

                // Update last active timestamp
                localStorage.setItem('lastActiveTimestamp', now.toISOString());
            }

            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        checkSessionExpiry();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                // Update timestamp on auth state change (login, token refresh)
                localStorage.setItem('lastActiveTimestamp', new Date().toISOString());
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
