// Supabase configuration
export const getSupabaseUrl = () => {
  // This will be automatically set when deployed to Lovable with Supabase integration
  return import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co'
}

export const getContactEndpoint = () => {
  return `${getSupabaseUrl()}/functions/v1/contact`
}