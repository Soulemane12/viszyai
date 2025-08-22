-- Analytics Database Schema for Viszy
-- This schema tracks user profile views, QR scans, and other analytics data

-- Profile views tracking
CREATE TABLE IF NOT EXISTS profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    viewer_ip TEXT,
    viewer_user_agent TEXT,
    viewer_country TEXT,
    viewer_city TEXT,
    viewer_latitude DECIMAL(10, 8),
    viewer_longitude DECIMAL(11, 8),
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR code scans tracking
CREATE TABLE IF NOT EXISTS qr_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scanner_ip TEXT,
    scanner_user_agent TEXT,
    scanner_country TEXT,
    scanner_city TEXT,
    scanner_latitude DECIMAL(10, 8),
    scanner_longitude DECIMAL(11, 8),
    device_type TEXT, -- mobile, desktop, tablet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact downloads tracking
CREATE TABLE IF NOT EXISTS contact_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    downloader_ip TEXT,
    downloader_user_agent TEXT,
    downloader_country TEXT,
    downloader_city TEXT,
    download_type TEXT, -- vcf, manual
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social link clicks tracking
CREATE TABLE IF NOT EXISTS social_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    social_link_id UUID NOT NULL REFERENCES social_links(id) ON DELETE CASCADE,
    clicker_ip TEXT,
    clicker_user_agent TEXT,
    clicker_country TEXT,
    clicker_city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON profile_views(created_at);
CREATE INDEX IF NOT EXISTS idx_qr_scans_profile_id ON qr_scans(profile_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_created_at ON qr_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_downloads_profile_id ON contact_downloads(profile_id);
CREATE INDEX IF NOT EXISTS idx_contact_downloads_created_at ON contact_downloads(created_at);
CREATE INDEX IF NOT EXISTS idx_social_clicks_profile_id ON social_clicks(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_clicks_created_at ON social_clicks(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_clicks ENABLE ROW LEVEL SECURITY;

-- Users can view analytics for their own profiles
CREATE POLICY "Users can view analytics for their own profiles" ON profile_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = profile_views.profile_id 
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view QR scans for their own profiles" ON qr_scans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = qr_scans.profile_id 
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view contact downloads for their own profiles" ON contact_downloads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = contact_downloads.profile_id 
            AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view social clicks for their own profiles" ON social_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = social_clicks.profile_id 
            AND profiles.user_id = auth.uid()
        )
    );

-- Anyone can insert analytics data (for tracking)
CREATE POLICY "Anyone can insert profile views" ON profile_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert QR scans" ON qr_scans
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert contact downloads" ON contact_downloads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert social clicks" ON social_clicks
    FOR INSERT WITH CHECK (true);

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_profile_analytics(profile_handle TEXT)
RETURNS TABLE (
    total_views BIGINT,
    total_scans BIGINT,
    total_downloads BIGINT,
    total_social_clicks BIGINT,
    unique_visitors BIGINT,
    top_countries JSON,
    recent_activity JSON,
    monthly_views JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH profile_data AS (
        SELECT id FROM profiles WHERE handle = profile_handle
    ),
    views_data AS (
        SELECT COUNT(*) as total_views,
               COUNT(DISTINCT viewer_ip) as unique_visitors
        FROM profile_views pv
        JOIN profile_data pd ON pv.profile_id = pd.id
    ),
    scans_data AS (
        SELECT COUNT(*) as total_scans
        FROM qr_scans qs
        JOIN profile_data pd ON qs.profile_id = pd.id
    ),
    downloads_data AS (
        SELECT COUNT(*) as total_downloads
        FROM contact_downloads cd
        JOIN profile_data pd ON cd.profile_id = pd.id
    ),
    social_clicks_data AS (
        SELECT COUNT(*) as total_social_clicks
        FROM social_clicks sc
        JOIN profile_data pd ON sc.profile_id = pd.id
    ),
    countries_data AS (
        SELECT json_agg(
            json_build_object(
                'country', COALESCE(viewer_country, 'Unknown'),
                'views', COUNT(*)
            )
        ) as top_countries
        FROM (
            SELECT viewer_country, COUNT(*) 
            FROM profile_views pv
            JOIN profile_data pd ON pv.profile_id = pd.id
            WHERE viewer_country IS NOT NULL
            GROUP BY viewer_country
            ORDER BY COUNT(*) DESC
            LIMIT 5
        ) t
    ),
    activity_data AS (
        SELECT json_agg(
            json_build_object(
                'date', TO_CHAR(created_at, 'YYYY-MM-DD'),
                'action', 'Profile viewed',
                'location', COALESCE(viewer_city || ', ' || viewer_country, 'Unknown')
            )
        ) as recent_activity
        FROM (
            SELECT created_at, viewer_city, viewer_country
            FROM profile_views pv
            JOIN profile_data pd ON pv.profile_id = pd.id
            ORDER BY created_at DESC
            LIMIT 10
        ) t
    ),
    monthly_data AS (
        SELECT json_agg(
            json_build_object(
                'month', TO_CHAR(created_at, 'Mon'),
                'views', COUNT(*)
            )
        ) as monthly_views
        FROM (
            SELECT created_at, COUNT(*)
            FROM profile_views pv
            JOIN profile_data pd ON pv.profile_id = pd.id
            WHERE created_at >= NOW() - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY DATE_TRUNC('month', created_at) DESC
        ) t
    )
    SELECT 
        vd.total_views,
        sd.total_scans,
        dd.total_downloads,
        scd.total_social_clicks,
        vd.unique_visitors,
        cd.top_countries,
        ad.recent_activity,
        md.monthly_views
    FROM views_data vd
    CROSS JOIN scans_data sd
    CROSS JOIN downloads_data dd
    CROSS JOIN social_clicks_data scd
    CROSS JOIN countries_data cd
    CROSS JOIN activity_data ad
    CROSS JOIN monthly_data md;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
