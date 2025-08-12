-- Create a demo admin user in Supabase Auth
-- This is for development/testing purposes only

-- First, you need to create the user through Supabase Auth
-- You can do this via the Supabase dashboard or using the auth.users table

-- Insert demo admin user (replace with your actual admin email)
-- Note: This should be done through Supabase Auth signup, not directly in the database

-- Example of what the admin user record would look like:
-- INSERT INTO auth.users (
--   id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   raw_app_meta_data,
--   raw_user_meta_data
-- ) VALUES (
--   gen_random_uuid(),
--   'admin@sendam.com',
--   crypt('admin123', gen_salt('bf')),
--   now(),
--   now(),
--   now(),
--   '{"provider": "email", "providers": ["email"]}',
--   '{"full_name": "Admin User"}'
-- );

-- Instead, create the admin user through the Supabase Auth signup process
-- or through the Supabase dashboard under Authentication > Users

-- For development, you can create a user with email: admin@sendam.com
-- and password: admin123

-- Then update the admin emails list in your code to include this email
