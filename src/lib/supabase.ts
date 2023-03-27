import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database"

const SUPABASE_URL = 'https://bzfzpauxogprfigwhuwb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZnpwYXV4b2dwcmZpZ3dodXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NTAwMjMsImV4cCI6MTk5NTQyNjAyM30.qfrmhnoZIT0nBrGHpHXNZ2z4R4GdjiUkFjtr4qsTgC4'
export default createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

const url = 'postgresql://postgres:o2oeKFPZu9TDtssf@db.bzfzpauxogprfigwhuwb.supabase.co:5432/postgres'