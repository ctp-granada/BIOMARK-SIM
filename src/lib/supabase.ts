/**
 * Supabase Client Configuration & Fallback Mock for local/preview execution
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase.ugr.es';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-ugr-biomark';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
