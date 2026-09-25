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

if __name__ == "__main__":
    unittest.main()
