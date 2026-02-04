import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ORIGIN = "https://consoltech.shop"

function cors(h = new Headers()) {
  h.set("Access-Control-Allow-Origin", ORIGIN)
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  h.set("Access-Control-Allow-Headers", "content-type, authorization")
  h.set("Vary", "Origin")
  return h
}

interface ContactRequest {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  recaptchaToken?: string
  honeypot?: string
  page_url?: string
  timestamp?: string
}

serve(async (req) => {
  const { method } = req

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors() })
  }

  if (method !== "POST") {
    const h = cors(new Headers({ "Content-Type": "application/json", "Allow": "POST, OPTIONS" }))
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), { status: 405, headers: h })
  }

  try {
    const { name, email, company, subject, message } = await req.json()
    
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
        status: 422, 
        headers: cors(new Headers({ "Content-Type": "application/json" }))
      })
    }

    // Initialize Supabase client for storage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get client IP for basic tracking
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Generate unique ID for this message
    const messageId = crypto.randomUUID()

    // Store submission in database
    const { error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert({
        id: messageId,
        name,
        email,
        company: company || '',
        subject,
        message,
        page_url: '',
        ua: userAgent,
        ip_address: clientIP,
        status: 'queued',
        attempts: 0,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(JSON.stringify({ ok: false, error: "Failed to store message" }), {
        status: 500,
        headers: cors(new Headers({ "Content-Type": "application/json" }))
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, 
      headers: cors(new Headers({ "Content-Type": "application/json" }))
    })
    
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Bad request" }), {
      status: 400, 
      headers: cors(new Headers({ "Content-Type": "application/json" }))
    })
  }
})