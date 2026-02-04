# Contact Form Setup Instructions

## Required Environment Variables

Set these in your Supabase project dashboard under "Settings > API Keys":

### 1. Email Service (Resend)
```
RESEND_API_KEY=re_your_api_key_here
```
Sign up at [resend.com](https://resend.com) and get your API key.

### 2. reCAPTCHA v3 (Optional but Recommended)
```
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

Update the site key in `src/pages/Contact.tsx`:
```typescript
const RECAPTCHA_SITE_KEY = "your_site_key_here";
```

Get keys from [Google reCAPTCHA v3](https://www.google.com/recaptcha/admin/).

## Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_created 
ON contact_messages (ip_address, created_at);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for the edge function)
CREATE POLICY "Allow inserts for contact form" ON contact_messages
FOR INSERT WITH CHECK (true);

-- Create policy to allow admin access (optional, for viewing submissions)
CREATE POLICY "Allow admin access" ON contact_messages
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

## Deployment

1. Deploy the edge function:
```bash
supabase functions deploy contact
```

2. The contact form will automatically use the correct endpoint URL.

## Features Implemented

✅ **Email Routing**: Messages sent to `sales@consoltech.shop` with user's email as Reply-To  
✅ **Auto-Response**: Confirmation email sent to user  
✅ **Spam Protection**: Honeypot field + reCAPTCHA v3 verification  
✅ **Rate Limiting**: Max 5 submissions per IP per hour  
✅ **Validation**: Required fields + email format validation  
✅ **Storage**: All submissions stored in `contact_messages` table  
✅ **UI/UX**: Loading states, success/error toasts, form clearing  

## Testing

After setup:
1. Submit a test message
2. Check that email arrives at `sales@consoltech.shop`
3. Verify auto-response arrives to test email
4. Check rate limiting by submitting >5 messages quickly
5. Verify database storage in Supabase dashboard

## Configuration Notes

- **From Address**: `no-reply@consoltech.shop` (configure DNS/SPF records)
- **Rate Limit**: 5 submissions per hour per IP address
- **reCAPTCHA**: Minimum score of 0.5 required
- **Auto-Response**: Includes user's submitted details