import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
)

console.log('Testing login with test@example.com...')

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'validpassword123',
})

if (error) {
  console.error('Login failed:', error)
  process.exit(1)
}

console.log('Login successful!')
console.log('User:', data.user.email)
console.log('Session:', data.session ? 'Present' : 'Missing')
console.log('Access token:', data.session?.access_token?.substring(0, 20) + '...')
