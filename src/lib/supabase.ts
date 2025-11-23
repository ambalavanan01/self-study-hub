import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are configured
export const isConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create client only if configured, otherwise use a dummy client
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key');
