import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using localStorage fallback.');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Disable auto refresh when not configured to prevent errors
      autoRefreshToken: Boolean(supabaseUrl && supabaseAnonKey),
      persistSession: Boolean(supabaseUrl && supabaseAnonKey),
      detectSessionInUrl: Boolean(supabaseUrl && supabaseAnonKey),
    },
  }
);

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Check if Supabase is reachable
export const checkSupabaseHealth = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch (err) {
    console.warn('Supabase health check failed:', err);
    return false;
  }
};
