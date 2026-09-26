import unittest
import os
import re

class TestDatabaseMigration(unittest.TestCase):
    def setUp(self):
        self.migration_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "supabase",
            "migrations",
            "20260925000000_initial_schema.sql"
        )
        with open(self.migration_path, "r", encoding="utf-8") as f:
            self.sql = f.read()

    def test_required_tables_exist(self):
        required_tables = [
            "public.profiles",
            "public.projects",
            "public.brand_runs",
            "public.brand_artifacts",
            "public.selected_directions",
            "public.exports",
        ]
        for table in required_tables:
            pattern = rf"CREATE TABLE IF NOT EXISTS {table.replace('.', r'\.')}"
            self.assertRegex(self.sql, pattern, f"Table {table} missing from migration")

    def test_foreign_key_constraints(self):
        self.assertIn("REFERENCES auth.users(id) ON DELETE CASCADE", self.sql)
        self.assertIn("REFERENCES public.profiles(id) ON DELETE CASCADE", self.sql)
        self.assertIn("REFERENCES public.projects(id) ON DELETE CASCADE", self.sql)
        self.assertIn("REFERENCES public.brand_runs(id) ON DELETE CASCADE", self.sql)

    def test_rls_enabled_on_all_tables(self):
        tables = ["profiles", "projects", "brand_runs", "brand_artifacts", "selected_directions", "exports"]
        for table in tables:
            pattern = rf"ALTER TABLE public\.{table} ENABLE ROW LEVEL SECURITY;"
            self.assertRegex(self.sql, pattern, f"RLS not enabled on public.{table}")

    def test_auth_user_trigger_exists(self):
        self.assertIn("CREATE OR REPLACE FUNCTION public.handle_new_user()", self.sql)
        self.assertIn("CREATE TRIGGER on_auth_user_created", self.sql)
        self.assertIn("AFTER INSERT ON auth.users", self.sql)

    def test_updated_at_trigger_exists(self):
        self.assertIn("CREATE OR REPLACE FUNCTION public.update_updated_at_column()", self.sql)
        self.assertIn("CREATE TRIGGER tr_projects_updated_at", self.sql)
        self.assertIn("BEFORE UPDATE ON public.projects", self.sql)

    def test_storage_bucket_and_policies_exist(self):
        self.assertIn("INSERT INTO storage.buckets", self.sql)
        self.assertIn("'brand-assets'", self.sql)
        self.assertIn("CREATE POLICY \"Storage: Authenticated users can view own brand assets\"", self.sql)
        self.assertIn("(storage.foldername(name))[1] = auth.uid()::text", self.sql)

    def test_supabase_secret_key_no_browser_fallback(self):
        from apps.api.app.core.config import _resolve_supabase_secret_key
        orig_secret = os.environ.get("SUPABASE_SECRET_KEY")
        orig_legacy = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        orig_env = os.environ.get("ENVIRONMENT")
        
        try:
            if "SUPABASE_SECRET_KEY" in os.environ:
                del os.environ["SUPABASE_SECRET_KEY"]
            if "SUPABASE_SERVICE_ROLE_KEY" in os.environ:
                del os.environ["SUPABASE_SERVICE_ROLE_KEY"]
            os.environ["ENVIRONMENT"] = "development"
            os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "fake-anon-key"
            os.environ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] = "fake-publishable-key"

            # Must NOT return fake-anon-key or fake-publishable-key
            key = _resolve_supabase_secret_key()
            self.assertEqual(key, "")
        finally:
            if orig_secret is not None:
                os.environ["SUPABASE_SECRET_KEY"] = orig_secret
            elif "SUPABASE_SECRET_KEY" in os.environ:
                del os.environ["SUPABASE_SECRET_KEY"]
            if orig_legacy is not None:
                os.environ["SUPABASE_SERVICE_ROLE_KEY"] = orig_legacy
            if orig_env is not None:
                os.environ["ENVIRONMENT"] = orig_env

    def test_production_fails_explicitly_if_secret_missing(self):
        from apps.api.app.core.config import _resolve_supabase_secret_key
        orig_secret = os.environ.get("SUPABASE_SECRET_KEY")
        orig_legacy = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        orig_env = os.environ.get("ENVIRONMENT")

        try:
            if "SUPABASE_SECRET_KEY" in os.environ:
                del os.environ["SUPABASE_SECRET_KEY"]
            if "SUPABASE_SERVICE_ROLE_KEY" in os.environ:
                del os.environ["SUPABASE_SERVICE_ROLE_KEY"]
            os.environ["ENVIRONMENT"] = "production"

            with self.assertRaises(RuntimeError) as ctx:
                _resolve_supabase_secret_key()
            self.assertIn("SUPABASE_SECRET_KEY is missing", str(ctx.exception))
        finally:
            if orig_secret is not None:
                os.environ["SUPABASE_SECRET_KEY"] = orig_secret
            elif "SUPABASE_SECRET_KEY" in os.environ:
                del os.environ["SUPABASE_SECRET_KEY"]
            if orig_legacy is not None:
                os.environ["SUPABASE_SERVICE_ROLE_KEY"] = orig_legacy
            if orig_env is not None:
                os.environ["ENVIRONMENT"] = orig_env


if __name__ == "__main__":
    unittest.main()
