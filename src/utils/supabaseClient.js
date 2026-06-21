import { createClient } from '@supabase/supabase-js'

// EXACT credentials from your project
const supabaseUrl = 'https://rmxbhxepcwtreaoeeohp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteGJoeGVwY3d0cmVhb2Vlb2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5Nzc4ODMsImV4cCI6MjA5NzU1Mzg4M30.Z9erthZ0hvhbShC27OXNED0zv7g_tW7lbUewZDKstaw'

console.log('Supabase Client Loaded');
console.log('URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
