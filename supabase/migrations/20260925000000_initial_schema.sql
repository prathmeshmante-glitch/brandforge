-- ============================================================================
-- BrandForge Supabase PostgreSQL Migration
-- Version: 20260925000000_initial_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    idea TEXT NOT NULL,
    status TEXT DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. BRAND RUNS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unq_project_version UNIQUE (project_id, version)
);

-- ----------------------------------------------------------------------------
-- 4. BRAND ARTIFACTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES public.brand_runs(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    artifact_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 5. SELECTED DIRECTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.selected_directions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    direction_type TEXT NOT NULL,
    selected_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. EXPORTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR QUERY OPTIMIZATION
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_runs_project_id ON public.brand_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_brand_artifacts_run_id ON public.brand_artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_brand_artifacts_run_stage ON public.brand_artifacts(run_id, stage);
CREATE INDEX IF NOT EXISTS idx_selected_directions_project_id ON public.selected_directions(project_id);
CREATE INDEX IF NOT EXISTS idx_exports_project_id ON public.exports(project_id);

-- ----------------------------------------------------------------------------
-- AUTOMATIC TIMESTAMPTZ TRIGGER FOR PROJECTS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_projects_updated_at ON public.projects;
CREATE TRIGGER tr_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- AUTH USER AUTOMATIC PROFILE CREATION TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) ENABLEMENT
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selected_directions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR PROFILES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles: Users can view own profile" ON public.profiles;
CREATE POLICY "Profiles: Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: Users can update own profile" ON public.profiles;
CREATE POLICY "Profiles: Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: Users can insert own profile" ON public.profiles;
CREATE POLICY "Profiles: Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR PROJECTS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Projects: Users can manage own projects" ON public.projects;
CREATE POLICY "Projects: Users can manage own projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR BRAND RUNS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Brand Runs: Users can access own brand runs" ON public.brand_runs;
CREATE POLICY "Brand Runs: Users can access own brand runs"
    ON public.brand_runs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = brand_runs.project_id
            AND projects.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = brand_runs.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR BRAND ARTIFACTS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Brand Artifacts: Users can access own artifacts" ON public.brand_artifacts;
CREATE POLICY "Brand Artifacts: Users can access own artifacts"
    ON public.brand_artifacts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.brand_runs
            JOIN public.projects ON projects.id = brand_runs.project_id
            WHERE brand_runs.id = brand_artifacts.run_id
            AND projects.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.brand_runs
            JOIN public.projects ON projects.id = brand_runs.project_id
            WHERE brand_runs.id = brand_artifacts.run_id
            AND projects.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR SELECTED DIRECTIONS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Selected Directions: Users can manage own selections" ON public.selected_directions;
CREATE POLICY "Selected Directions: Users can manage own selections"
    ON public.selected_directions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = selected_directions.project_id
            AND projects.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = selected_directions.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR EXPORTS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Exports: Users can access own exports" ON public.exports;
CREATE POLICY "Exports: Users can access own exports"
    ON public.exports FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = exports.project_id
            AND projects.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = exports.project_id
            AND projects.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- SUPABASE STORAGE BUCKET INITIALIZATION & SECURITY
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'brand-assets',
    'brand-assets',
    false,
    52428800, -- 50 MB limit
    ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/svg+xml', 'application/json']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies (path convention: {user_id}/{project_id}/*)
DROP POLICY IF EXISTS "Storage: Authenticated users can view own brand assets" ON storage.objects;
CREATE POLICY "Storage: Authenticated users can view own brand assets"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'brand-assets'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Storage: Authenticated users can upload own brand assets" ON storage.objects;
CREATE POLICY "Storage: Authenticated users can upload own brand assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'brand-assets'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Storage: Authenticated users can update own brand assets" ON storage.objects;
CREATE POLICY "Storage: Authenticated users can update own brand assets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'brand-assets'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'brand-assets'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Storage: Authenticated users can delete own brand assets" ON storage.objects;
CREATE POLICY "Storage: Authenticated users can delete own brand assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'brand-assets'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
