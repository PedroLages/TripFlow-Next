import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
)

const { data, error } = await supabase.auth.admin.createUser({
  email: 'test@example.com',
  password: 'validpassword123',
  email_confirm: true,
})

if (error) {
  console.error('Error creating user:', error)
  process.exit(1)
}

console.log('Test user created successfully:', data.user.email)
