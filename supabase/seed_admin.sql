-- Script untuk membuat Default Admin User di Supabase Auth
-- Jalankan script ini di SQL Editor Dasbor Supabase Anda!

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- 1. Insert ke tabel auth.users
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, recovery_sent_at, last_sign_in_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', 
    new_user_id, 
    'authenticated', 
    'authenticated', 
    'admin.certifix@gmail.com', 
    crypt('admin123!', gen_salt('bf')), -- Password: admin123!
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', 
    '{"name":"System Admin"}', 
    now(), now(),
    '', '', '', ''
  );

  -- 2. Insert ke tabel auth.identities (Wajib agar bisa login via API Supabase)
  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), 
    new_user_id, 
    new_user_id::text, 
    format('{"sub":"%s","email":"admin.certifix@gmail.com"}', new_user_id)::jsonb, 
    'email', 
    now(), now(), now()
  );
END $$;
