-- Admin User Setup Guide for Supabase
-- This script provides instructions for creating admin users

-- IMPORTANT: You cannot directly insert into auth.users table
-- You must create users through the Supabase Auth system

-- Method 1: Using Supabase Dashboard (Recommended)
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Authentication → Users
-- 3. Click "Add user" button
-- 4. Fill in the form:
--    - Email: admin@sendam.com
--    - Password: admin123
--    - Email Confirm: Check this box (important!)
--    - Phone Confirm: Leave unchecked
-- 5. Click "Create user"
-- 6. The user will be created and can immediately log in

-- Method 2: Using Supabase CLI (Advanced)
-- Run this command in your terminal:
-- supabase auth users create admin@sendam.com --password admin123

-- Method 3: Using Supabase JavaScript Client (Programmatic)
-- You can create a temporary signup page or use the browser console:
/*
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

async function createAdminUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@sendam.com',
    password: 'admin123',
    options: {
      data: {
        full_name: 'Admin User'
      }
    }
  })
  
  if (error) {
    console.error('Error creating admin user:', error)
  } else {
    console.log('Admin user created:', data)
  }
}

createAdminUser()
*/

-- Verify admin user exists
-- You can check if the user was created by running this query:
-- SELECT id, email, email_confirmed_at, created_at 
-- FROM auth.users 
-- WHERE email = 'admin@sendam.com';

-- The user should appear in the results with:
-- - A valid UUID as id
-- - email: admin@sendam.com  
-- - email_confirmed_at: should have a timestamp (not null)
-- - created_at: should have a timestamp

-- If email_confirmed_at is null, you need to confirm the email:
-- 1. Go to Authentication → Users in Supabase dashboard
-- 2. Find the admin@sendam.com user
-- 3. Click the three dots menu
-- 4. Select "Send confirmation email" or manually confirm

-- Additional admin emails can be added by:
-- 1. Creating more users with the same process
-- 2. Adding their emails to the adminEmails array in the code:
--    - app/admin/page.tsx
--    - app/admin/login/page.tsx
--    - middleware.ts

-- Example of adding more admin emails in code:
-- const adminEmails = [
--   "admin@sendam.com",
--   "admin@example.com", 
--   "your-email@domain.com",  // Add your email here
--   "another-admin@company.com"
-- ]
