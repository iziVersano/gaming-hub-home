import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ContactMessage {
  id: string
  name: string
  email: string
  company?: string
  subject: string
  message: string
  page_url?: string
  ua?: string
  ip_address?: string
  status: 'queued' | 'sent' | 'dead'
  attempts: number
  last_error?: string
  created_at: string
}

const sendEmailViaResend = async (message: ContactMessage, resendApiKey: string) => {
  const emailData = {
    from: 'no-reply@consoltech.shop',
    to: ['sales@consoltech.shop'],
    reply_to: message.email,
    subject: `New website inquiry – ${message.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${message.name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Company:</strong> ${message.company || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted at: ${message.created_at}</small></p>
      <p><small>Page URL: ${message.page_url || 'N/A'}</small></p>
      <p><small>IP: ${message.ip_address || 'N/A'}</small></p>
      <p><small>User Agent: ${message.ua || 'N/A'}</small></p>
    `
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend API error: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

const sendAutoResponse = async (message: ContactMessage, resendApiKey: string) => {
  const autoResponseData = {
    from: 'no-reply@consoltech.shop',
    to: [message.email],
    subject: 'We received your message – Consoltech',
    html: `
      <h2>Thank you for contacting Consoltech!</h2>
      <p>Hi ${message.name},</p>
      <p>We have received your message regarding "${message.subject}" and will get back to you shortly.</p>
      
      <h3>Your Message Details:</h3>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Message:</strong> ${message.message}</p>
      
      <p>Our team typically responds within 24 hours during business days.</p>
      
      <p>Best regards,<br>
      The Consoltech Team</p>
      
      <hr>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    `
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(autoResponseData)
  })

  if (!response.ok) {
    console.error('Auto-response failed:', await response.text())
  }
}

const sendDeadLetterAlert = async (message: ContactMessage, resendApiKey: string) => {
  const alertData = {
    from: 'no-reply@consoltech.shop',
    to: ['alerts@consoltech.shop', 'sales@consoltech.shop'],
    subject: 'ALERT: Contact message failed after 5 attempts',
    html: `
      <h2>⚠️ Contact Message Dead Letter Alert</h2>
      <p><strong>Message ID:</strong> ${message.id}</p>
      <p><strong>From:</strong> ${message.name} (${message.email})</p>
      <p><strong>Company:</strong> ${message.company || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <p><strong>Last Error:</strong> ${message.last_error}</p>
      <p><strong>Attempts:</strong> ${message.attempts}</p>
      <p><strong>Created:</strong> ${message.created_at}</p>
      <hr>
      <p><strong>Original Message:</strong></p>
      <p>${message.message.replace(/\n/g, '<br>')}</p>
    `
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(alertData)
  })
}

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.log('No Resend API key configured')
      return new Response('No email provider configured', { status: 200 })
    }

    // Select queued messages with less than 5 attempts
    const { data: queuedMessages, error: fetchError } = await supabaseClient
      .from('contact_messages')
      .select('*')
      .eq('status', 'queued')
      .lt('attempts', 5)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching queued messages:', fetchError)
      return new Response('Database error', { status: 500 })
    }

    if (!queuedMessages || queuedMessages.length === 0) {
      return new Response('No messages to process', { status: 200 })
    }

    let processed = 0
    let errors = 0

    for (const message of queuedMessages) {
      try {
        // Try to send the email
        await sendEmailViaResend(message, resendApiKey)
        
        // Send auto-response on first successful send
        if (message.attempts === 0) {
          await sendAutoResponse(message, resendApiKey)
        }

        // Mark as sent
        await supabaseClient
          .from('contact_messages')
          .update({ 
            status: 'sent',
            last_error: null
          })
          .eq('id', message.id)

        processed++
        console.log(`Successfully sent message ${message.id}`)

      } catch (error) {
        errors++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const newAttempts = message.attempts + 1
        
        if (newAttempts >= 5) {
          // Mark as dead and send alert
          await supabaseClient
            .from('contact_messages')
            .update({ 
              status: 'dead',
              attempts: newAttempts,
              last_error: errorMessage
            })
            .eq('id', message.id)

          // Send dead letter alert
          try {
            await sendDeadLetterAlert({ ...message, attempts: newAttempts, last_error: errorMessage }, resendApiKey)
          } catch (alertError) {
            console.error('Failed to send dead letter alert:', alertError)
          }

          console.error(`Message ${message.id} marked as dead after ${newAttempts} attempts: ${errorMessage}`)
        } else {
          // Increment attempts and keep in queue
          await supabaseClient
            .from('contact_messages')
            .update({ 
              attempts: newAttempts,
              last_error: errorMessage
            })
            .eq('id', message.id)

          console.error(`Message ${message.id} attempt ${newAttempts} failed: ${errorMessage}`)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        processed, 
        errors, 
        total: queuedMessages.length 
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Email sender function error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})
