-- Add explicit RLS policies for user_roles table to follow security best practices
-- This prevents direct modifications to user roles outside of the signup trigger

-- Policy to explicitly deny direct INSERT operations
-- Roles should only be inserted via the handle_new_user_role() trigger
CREATE POLICY "Prevent direct role insertion"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy to explicitly deny UPDATE operations
-- Roles should be immutable once assigned
CREATE POLICY "Prevent role modifications"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Policy to explicitly deny DELETE operations
-- Role records should not be deleted directly
CREATE POLICY "Prevent role deletion"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);

-- The existing SELECT policy remains in place:
-- "Users can view their own roles" allows SELECT WHERE auth.uid() = user_id

-- Note: These explicit deny policies make the security posture clear and auditable.
-- The handle_new_user_role() trigger uses SECURITY DEFINER to bypass these policies
-- and insert roles during user signup, which is the only intended way to create roles.