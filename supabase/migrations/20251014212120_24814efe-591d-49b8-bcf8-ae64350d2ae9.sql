-- Create table for discount page products
CREATE TABLE public.discount_page_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_page_products ENABLE ROW LEVEL SECURITY;

-- Policies for discount_page_products
CREATE POLICY "Anyone can view discount page products"
ON public.discount_page_products
FOR SELECT
USING (true);

CREATE POLICY "Owners can insert discount page products"
ON public.discount_page_products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'owner'::app_role
  )
);

CREATE POLICY "Owners can update discount page products"
ON public.discount_page_products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'owner'::app_role
  )
);

CREATE POLICY "Owners can delete discount page products"
ON public.discount_page_products
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'owner'::app_role
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_discount_page_products_updated_at
BEFORE UPDATE ON public.discount_page_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();