-- Clean up duplicate RLS policies
-- This script removes the duplicate policies that are causing conflicts

-- Drop the duplicate policies for social_links (the ones with {public} role)
DROP POLICY IF EXISTS "Users can delete social links for their profile" ON social_links;
DROP POLICY IF EXISTS "Users can insert social links for their profile" ON social_links;
DROP POLICY IF EXISTS "Users can update social links for their profile" ON social_links;

-- Verify the remaining policies
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

-- Test the policies work correctly
-- This should show only the correct policies without duplicates
