import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database"
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'

export default createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)