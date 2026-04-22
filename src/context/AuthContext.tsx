import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
    signInWithGoogle: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obter sessão atual na montagem
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Escutar mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            // Persistir Refresh Token para Agenda Colaborativa
            if (session?.provider_refresh_token && session.user?.email) {
                try {
                    await supabase.from('user_calendar_connections').upsert({
                        user_id: session.user.id,
                        email: session.user.email,
                        refresh_token: session.provider_refresh_token,
                        is_active: true,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });
                } catch (e) {
                    console.error("Erro ao persistir token da agenda:", e);
                }
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            // Limpeza forçada para evitar erros de cache/lock
            localStorage.clear();
            window.location.href = '/login';
        } catch (error) {
            console.error("Erro ao sair:", error);
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar.events',
                redirectTo: window.location.origin + '/agenda',
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            }
        });
        if (error) alert("Erro ao conectar com Google: " + error.message);
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
