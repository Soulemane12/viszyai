-- Fix RLS Policies for Supabase
-- This script will correct the RLS policies that are causing 42501 errors

-- First, disable RLS temporarily to clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view all social links" ON social_links;
DROP POLICY IF EXISTS "Users can insert their own social links" ON social_links;
DROP POLICY IF EXISTS "Users can update their own social links" ON social_links;
DROP POLICY IF EXISTS "Users can delete their own social links" ON social_links;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Create CORRECT RLS Policies for profiles table

-- Allow users to view all profiles (public access)
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create CORRECT RLS Policies for social_links table

-- Allow users to view all social links (public access)
CREATE POLICY "Users can view all social links" ON social_links
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Allow authenticated users to insert social links for their own profile
CREATE POLICY "Users can insert their own social links" ON social_links
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = social_links.profile_id 
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow users to update social links for their own profile
CREATE POLICY "Users can update their own social links" ON social_links
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = social_links.profile_id 
            AND profiles.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = social_links.profile_id 
            AND profiles.user_id = auth.uid()
        )
    );

-- Allow users to delete social links for their own profile
CREATE POLICY "Users can delete their own social links" ON social_links
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = social_links.profile_id 
            AND profiles.user_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON profiles TO anon, authenticated;
GRANT ALL ON social_links TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify the policies were created correctly
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'social_links')
ORDER BY tablename, policyname;
