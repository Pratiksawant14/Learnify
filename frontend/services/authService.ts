
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export const authService = {
    async signUp(email: string, password: string) {
        return await supabase.auth.signUp({
            email,
            password,
        });
    },

    async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    },

    async signOut() {
        return await supabase.auth.signOut();
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user || null);
        });
    }
};
