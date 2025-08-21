import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client with explicit configuration
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: { 'x-application-name': 'Viszy' },
    },
  }
);

// Global error handling is managed by individual queries
