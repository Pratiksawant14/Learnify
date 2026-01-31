
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export const authService = {
    async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return { data, error };

        if (data.user) {
            // Manual trigger fallback: Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    name: email.split('@')[0], // Default name
                    avatar: '',
                    bio: 'Just joined Learnify!',
                });

            if (profileError) {
                console.warn('Profile creation failed (might already exist via trigger):', profileError);
            }
        }

        return { data, error };
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
