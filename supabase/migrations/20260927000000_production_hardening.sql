-- ============================================================================
-- BrandForge Supabase PostgreSQL Migration
-- Version: 20260927000000_production_hardening.sql
-- Description: Adds project constraints, persistent chat messages, and public brand kit sharing
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ADD CONSTRAINTS COLUMN TO PROJECTS
-- ----------------------------------------------------------------------------
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS constraints JSONB NOT NULL DEFAULT '{}'::jsonb;

-- ----------------------------------------------------------------------------
-- 2. CREATE CHAT_MESSAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    tool_calls JSONB NOT NULL DEFAULT '[]'::jsonb,
    mentor_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for querying chat history ordered by time
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(project_id, created_at ASC);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ChatMessages: Users can select own project chat" ON public.chat_messages;
CREATE POLICY "ChatMessages: Users can select own project chat"
    ON public.chat_messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = chat_messages.project_id
            AND p.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "ChatMessages: Users can insert own project chat" ON public.chat_messages;
CREATE POLICY "ChatMessages: Users can insert own project chat"
    ON public.chat_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = chat_messages.project_id
            AND p.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 3. CREATE SHARED_BRAND_KITS TABLE (SECURE PUBLIC SHARING)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shared_brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE NOT NULL,
    brand_name TEXT NOT NULL,
    snapshot JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shared_brand_kits_token ON public.shared_brand_kits(share_token);
CREATE INDEX IF NOT EXISTS idx_shared_brand_kits_project ON public.shared_brand_kits(project_id);

-- Enable RLS on shared_brand_kits
ALTER TABLE public.shared_brand_kits ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated visitors can view active shared brand kits by token
DROP POLICY IF EXISTS "SharedBrandKits: Public read access for active shares" ON public.shared_brand_kits;
CREATE POLICY "SharedBrandKits: Public read access for active shares"
    ON public.shared_brand_kits FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Only project owners can create, update, or revoke shared brand kits
DROP POLICY IF EXISTS "SharedBrandKits: Project owners can create shares" ON public.shared_brand_kits;
CREATE POLICY "SharedBrandKits: Project owners can create shares"
    ON public.shared_brand_kits FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = shared_brand_kits.project_id
            AND p.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "SharedBrandKits: Project owners can update shares" ON public.shared_brand_kits;
CREATE POLICY "SharedBrandKits: Project owners can update shares"
    ON public.shared_brand_kits FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = shared_brand_kits.project_id
            AND p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = shared_brand_kits.project_id
            AND p.user_id = auth.uid()
        )
    );
