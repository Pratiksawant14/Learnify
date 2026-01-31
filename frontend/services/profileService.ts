
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
    id: string;
    name: string; // Changed from full_name/username
    bio: string;
    avatar: string; // Changed from avatar_url
    // Optional derived fields if needed
    username?: string; // Compatibility
}

export const profileService = {
    async getProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            // PGRST116: JSON object returned no rows (not an actual error for us, just means no profile yet)
            if (error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }
            return null;
        }
        return data;
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, ...updates })
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
        return data;
    },

    // For Public Profiles
    async getPublicProfile(username: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (error) return null;
        return data;
    }
};
