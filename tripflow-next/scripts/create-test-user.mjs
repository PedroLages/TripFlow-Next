#!/usr/bin/env node

/**
 * Script to create a test user for E2E tests
 * Run with: node scripts/create-test-user.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createTestUser() {
  const testEmail = 'test@example.com'
  const testPassword = 'validpassword123'

  console.log('🔧 Creating test user for E2E tests...')
  console.log('Email:', testEmail)

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(u => u.email === testEmail)

  if (existingUser) {
    console.log('ℹ️  User already exists with ID:', existingUser.id)

    // Update password to ensure it matches test expectations
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: testPassword }
    )

    if (updateError) {
      console.error('❌ Error updating user password:', updateError.message)
      process.exit(1)
    }

    console.log('✅ Updated user password')
    return
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      name: 'Test User',
    },
  })

  if (error) {
    console.error('❌ Error creating user:', error.message)
    process.exit(1)
  }

  console.log('✅ Test user created successfully!')
  console.log('User ID:', data.user.id)
  console.log('Email:', data.user.email)
  console.log('\n📋 Test credentials:')
  console.log('Email:', testEmail)
  console.log('Password:', testPassword)
  console.log('\n✅ Ready for E2E tests!')
}

createTestUser().catch((err) => {
  console.error('❌ Unexpected error:', err)
  process.exit(1)
})
