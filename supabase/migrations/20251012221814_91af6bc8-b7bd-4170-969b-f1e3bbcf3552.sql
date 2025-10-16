-- Create table for discount page content
CREATE TABLE public.discount_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  content TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.discount_pages ENABLE ROW LEVEL SECURITY;

-- Everyone can view
CREATE POLICY "Anyone can view discount pages"
ON public.discount_pages
FOR SELECT
TO authenticated
USING (true);

-- Only owners can update
CREATE POLICY "Owners can update discount pages"
ON public.discount_pages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Only owners can insert
CREATE POLICY "Owners can insert discount pages"
ON public.discount_pages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Insert default content for both pages
INSERT INTO public.discount_pages (page_name, content)
VALUES 
  ('50%', 'Welcome to the 50% discount page. Owners can edit this content.'),
  ('30%', 'Welcome to the 30% discount page. Owners can edit this content.');