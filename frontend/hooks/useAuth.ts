
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/services/authService';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        authService.getCurrentUser().then((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = authService.onAuthStateChange((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    return {
        user,
        loading,
        signIn: authService.signIn,
        signUp: authService.signUp,
        signOut
    };
}
