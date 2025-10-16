import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import CategoryNavigation from '@/components/CategoryNavigation';
import ProductSearch from '@/components/ProductSearch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DiscountProduct, ProductCategory, categorizeProduct } from '@/types/product';
import { useMobile } from '@/hooks/use-mobile';

const Discount30 = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const isMobile = useMobile();
  const [content, setContent] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<DiscountProduct[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    original_price: '',
    discounted_price: '',
  });

  useEffect(() => {
    fetchContent();
    fetchProducts();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_pages')
        .select('content')
        .eq('page_name', '30%')
        .single();

      if (error) throw error;
      setContent(data?.content || '');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load page content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_page_products')
        .select('*')
        .eq('page_name', '30%')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Add categories to products
      const productsWithCategories = (data || []).map(product => ({
        ...product,
        category: categorizeProduct(product.product_name)
      }));
      
      setProducts(productsWithCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category || categorizeProduct(product.product_name);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<ProductCategory, number>);
  }, [products]);

  // Filter products based on search term and selected category
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const category = product.category || categorizeProduct(product.product_name);
        return category === selectedCategory;
      });
    }
    
    return filtered;
  }, [products, selectedCategory, searchTerm]);

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('discount_pages')
        .update({ content: editedContent })
        .eq('page_name', '30%');

      if (error) throw error;

      setContent(editedContent);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Content updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const handleAddProduct = async () => {
    if (!newProduct.product_name || !newProduct.original_price || !newProduct.discounted_price) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('discount_page_products')
        .insert({
          page_name: '30%',
          product_name: newProduct.product_name,
          original_price: parseFloat(newProduct.original_price),
          discounted_price: parseFloat(newProduct.discounted_price),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product added successfully',
      });

      setNewProduct({ product_name: '', original_price: '', discounted_price: '' });
      setIsAddingProduct(false);
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discount_page_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-glow flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-glow">
      <Navbar />
      <AnimatedBackground />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-foreground">30% Discount</h1>
                {userRole === 'owner' && !isEditing && (
                  <Button onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={10}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none text-foreground">
                  <p className="whitespace-pre-wrap">{content}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Products</h2>
                {userRole === 'owner' && (
                  <Button onClick={() => setIsAddingProduct(true)} disabled={isAddingProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>

              {/* Search Bar */}
              <div className="mb-6 max-w-md">
                <ProductSearch
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search products or categories..."
                />
              </div>

              {/* Category Navigation */}
              <div className="mb-6">
                <CategoryNavigation
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categoryCounts={categoryCounts}
                  variant={isMobile ? 'dropdown' : 'scrollable-tabs'}
                />
              </div>

              {isAddingProduct && (
                <div className="mb-6 p-4 border border-border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input
                        value={newProduct.product_name}
                        onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Original Price</Label>
                      <Input
                        type="number"
                        value={newProduct.original_price}
                        onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Discounted Price</Label>
                      <Input
                        type="number"
                        value={newProduct.discounted_price}
                        onChange={(e) => setNewProduct({ ...newProduct, discounted_price: e.target.value })}
                        placeholder="70"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddProduct}>
                      <Save className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {selectedCategory === 'All' 
                    ? 'No products added yet' 
                    : `No products found in ${selectedCategory} category`
                  }
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => {
                    const category = product.category || categorizeProduct(product.product_name);
                    return (
                      <div
                        key={product.id}
                        className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-102 hover:border-primary/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-foreground bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                              {product.product_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground line-through">
                                Rs. {product.original_price}
                              </span>
                              <span className="text-lg">→</span>
                              <span className="text-xl font-bold bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                                Rs. {product.discounted_price}
                              </span>
                              <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                                {Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)}% OFF
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {category}
                          </div>
                        </div>
                        {userRole === 'owner' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Discount30;
