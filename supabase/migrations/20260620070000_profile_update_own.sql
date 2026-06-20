-- Allow authenticated users to update their own profile (e.g. display name).
-- Previously the profile table only had a SELECT policy, so RLS blocked all updates.
CREATE POLICY "Users can update own profile" ON "public"."profile"
    FOR UPDATE TO "authenticated"
    USING ((SELECT "auth"."uid"()) = "id")
    WITH CHECK ((SELECT "auth"."uid"()) = "id");

NOTIFY pgrst, 'reload schema';
