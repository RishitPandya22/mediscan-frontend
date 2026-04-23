import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://wzlqsivnbkobvszbbcin.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_TvdLgdpyde6kP2OhcILMMw_0lGGtA1n"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)