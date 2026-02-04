import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // This function should be called by a cron job every minute
  // For now, it can be triggered manually or via webhook
  
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-contact-emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json'
      }
    })

    const result = await response.text()
    
    return new Response(
      JSON.stringify({ 
        success: response.ok,
        status: response.status,
        result: result
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Queue processor error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process queue' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})