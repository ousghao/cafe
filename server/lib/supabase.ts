import { createClient } from '@supabase/supabase-js'

// Configuration Supabase pour Express
export const createExpressClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Configuration Supabase pour le serveur avec cookies
export const createServerClient = (request: Request) => {
  let response = new Response()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  )

  return { supabase, response }
} 