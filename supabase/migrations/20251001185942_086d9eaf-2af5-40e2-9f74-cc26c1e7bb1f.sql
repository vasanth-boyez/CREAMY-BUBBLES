-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('owner', 'staff');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create ice cream products table
CREATE TABLE public.ice_cream_products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.ice_cream_products ENABLE ROW LEVEL SECURITY;

-- RLS policies for products
CREATE POLICY "Anyone can view active products"
ON public.ice_cream_products
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Owners can insert products"
ON public.ice_cream_products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can update products"
ON public.ice_cream_products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can delete products"
ON public.ice_cream_products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ice_cream_products_updated_at
BEFORE UPDATE ON public.ice_cream_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default ice cream products
INSERT INTO public.ice_cream_products (name, price, icon_url) VALUES
('Vanilla Delight', 50, NULL),
('Chocolate Fudge', 60, NULL),
('Strawberry Bliss', 55, NULL),
('Mango Magic', 65, NULL),
('Butterscotch', 55, NULL),
('Mint Chocolate', 60, NULL),
('Cookie Crunch', 70, NULL),
('Pistachio Dream', 75, NULL),
('Black Current', 60, NULL),
('Caramel Swirl', 65, NULL);