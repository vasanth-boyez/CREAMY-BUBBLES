import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import CuteLoader from '@/components/CuteLoader';
import CategoryNavigation from '@/components/CategoryNavigation';
import CategorizedProducts from '@/components/CategorizedProducts';
import ProductSearch from '@/components/ProductSearch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductCategory, categorizeProduct } from '@/types/product';
import { useMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useMobile();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('ice_cream_products')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (error) throw error;
      
      // Add categories to products
      const productsWithCategories = (data || []).map(product => ({
        ...product,
        category: categorizeProduct(product.name)
      }));
      
      setProducts(productsWithCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  // Calculate category counts based on filtered products
  const categoryCounts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = product.category || categorizeProduct(product.name);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<ProductCategory, number>);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-gradient-ambient relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <CuteLoader />
            </div>
          ) : (
            <>
              <h2 className="text-5xl font-black text-center mb-8 bg-gradient-candy bg-clip-text text-transparent drop-shadow-glow animate-bounce-in">
                🍨 Our Delicious Flavors 🍨
              </h2>
              
              {/* Search Bar */}
              <div className="mb-6 max-w-md mx-auto">
                <ProductSearch
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search products or categories..."
                />
              </div>
              
              {/* Category Navigation */}
              <div className="mb-8">
                <CategoryNavigation
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categoryCounts={categoryCounts}
                  variant={isMobile ? 'dropdown' : 'scrollable-tabs'}
                  className="mb-6"
                />
              </div>

              {/* Categorized Products */}
              <CategorizedProducts
                products={filteredProducts}
                selectedCategory={selectedCategory}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
