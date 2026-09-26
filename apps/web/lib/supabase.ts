import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  missing: 'url' | 'key' | 'both' | null;
  errorMessage: string | null;
}

/**
 * Validates that actual, non-placeholder Supabase environment variables exist.
 * Never prints secret values.
 */
export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();

  const isUrlValid = Boolean(
    url &&
    (url.startsWith('https://') || url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) &&
    !url.includes('placeholder-project') &&
    !url.includes('your-supabase-project')
  );

  const isKeyValid = Boolean(
    key &&
    key !== 'placeholder-anon-key' &&
    key !== 'your-supabase-anon-key' &&
    key.length > 20
  );

  if (!isUrlValid && !isKeyValid) {
    return {
      isConfigured: false,
      missing: 'both',
      errorMessage: 'Supabase URL is missing and Supabase public key is missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in apps/web/.env.local',
    };
  }

  if (!isUrlValid) {
    return {
      isConfigured: false,
      missing: 'url',
      errorMessage: 'Supabase URL is missing. Please configure NEXT_PUBLIC_SUPABASE_URL in apps/web/.env.local',
    };
  }

  if (!isKeyValid) {
    return {
      isConfigured: false,
      missing: 'key',
      errorMessage: 'Supabase public key is missing. Please configure NEXT_PUBLIC_SUPABASE_ANON_KEY in apps/web/.env.local',
    };
  }

  return {
    isConfigured: true,
    missing: null,
    errorMessage: null,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfigStatus().isConfigured;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const status = getSupabaseConfigStatus();

  // For build-time / fallback initialization without breaking imports
  const effectiveUrl = status.isConfigured
    ? (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() as string)
    : 'https://unconfigured.supabase.co';

  const effectiveKey = status.isConfigured
    ? ((process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)?.trim() as string)
    : 'unconfigured-public-anon-key';

  if (!status.isConfigured && typeof window !== 'undefined') {
    console.warn(`[BrandForge Auth Config]: ${status.errorMessage}`);
  }

  if (typeof window === 'undefined') {
    return createClient(effectiveUrl, effectiveKey, {
      auth: {
        persistSession: false,
      },
      realtime: {
        transport: typeof WebSocket !== 'undefined' ? WebSocket : (class {} as any),
      },
    });
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(effectiveUrl, effectiveKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseInstance;
}

export const supabase = getSupabaseClient();

