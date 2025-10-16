import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { z } from 'zod';

// Product validation schema
const productSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  price: z.number()
    .positive('Price must be greater than 0')
    .max(100000, 'Price must be less than ₹100,000'),
  icon_url: z.string()
    .trim()
    .url('Invalid URL format')
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: 'URL must start with http:// or https://'
    })
    .or(z.literal(''))
    .optional()
});

interface Product {
  id: number;
  name: string;
  price: number;
  icon_url: string | null;
  is_active: boolean;
}

const OwnerPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', icon_url: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('ice_cream_products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching products:', error);
      }
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input data
    try {
      const validatedData = productSchema.parse({
        name: formData.name,
        price: parseFloat(formData.price),
        icon_url: formData.icon_url || undefined,
      });

      const productData = {
        name: validatedData.name,
        price: validatedData.price,
        icon_url: validatedData.icon_url || null,
        is_active: true,
      };

      try {
      if (editingProduct) {
        const { error } = await supabase
          .from('ice_cream_products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('ice_cream_products')
          .insert([productData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }

      setDialogOpen(false);
      setFormData({ name: '', price: '', icon_url: '' });
      setEditingProduct(null);
      fetchProducts();
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error saving product:', error);
        }
        toast({
          title: "Error",
          description: "Failed to save product",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Validation error
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid input data",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      icon_url: product.icon_url || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('ice_cream_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting product:', error);
      }
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('ice_cream_products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Product ${!product.is_active ? 'activated' : 'deactivated'}`,
      });
      fetchProducts();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error toggling product:', error);
      }
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-glow">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-ambient bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">Owner Panel - Manage Products</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ice" onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', icon_url: '' }); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon_url">Icon URL (Optional)</Label>
                    <Input
                      id="icon_url"
                      value={formData.icon_url}
                      onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <Button type="submit" variant="ice" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading products...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>
                        <Button
                          variant={product.is_active ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleActive(product)}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerPanel;
