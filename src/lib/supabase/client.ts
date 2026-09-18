// Supabase Client para uso no cliente (browser) com sincronização de cookies via SSR
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://offlrpkfddmhtuycyzpu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cria o cliente do Supabase sincronizado com cookies HTTP
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type { SupabaseClient }