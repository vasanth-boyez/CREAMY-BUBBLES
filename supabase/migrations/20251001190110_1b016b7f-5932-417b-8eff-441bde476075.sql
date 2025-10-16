-- Fix search_path security issue for update_updated_at_column function
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_ice_cream_products_updated_at
BEFORE UPDATE ON public.ice_cream_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();