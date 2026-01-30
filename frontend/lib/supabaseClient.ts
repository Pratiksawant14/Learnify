
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Key missing. Authentication features will be disabled.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
