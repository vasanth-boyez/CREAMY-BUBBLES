import React from 'react';
import { Trash2, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { generateBillPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Customer data validation schema
const customerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Customer name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  address: z.string()
    .trim()
    .max(500, 'Address must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  vehicleNo: z.string()
    .trim()
    .max(20, 'Vehicle number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  deliveryNote: z.string()
    .trim()
    .max(200, 'Delivery note must be less than 200 characters')
    .optional()
    .or(z.literal(''))
});

interface CustomerData {
  name: string;
  phone: string;
  address: string;
  vehicleNo: string;
  deliveryNote: string;
}

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const totalAmount = getTotalAmount();
  
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      vehicleNo: '',
      deliveryNote: ''
    }
  });

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleGenerateBill = (customerData: CustomerData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before generating a bill.",
        variant: "destructive",
      });
      return;
    }

    if (!customerData.name || !customerData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in customer name and phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const billerInfo = {
        name: user?.email?.split('@')[0] || 'Staff',
        email: user?.email || ''
      };
      
      generateBillPDF(cartItems, totalAmount, customerData, billerInfo);
      toast({
        title: "Bill generated!",
        description: "Your bill has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        title: "PDF Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred while generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-glow">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto shadow-ambient bg-card/80 backdrop-blur">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🍦</div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some delicious ice cream to get started!
              </p>
              <Button 
                variant="ice" 
                onClick={() => window.location.href = '/'}
                className="font-semibold"
              >
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-glow">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-ambient bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">Shopping Cart</CardTitle>
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Item Name</TableHead>
                    <TableHead className="font-semibold text-center">Quantity</TableHead>
                    <TableHead className="font-semibold text-right">Rate (₹)</TableHead>
                    <TableHead className="font-semibold text-right">Amount (₹)</TableHead>
                    <TableHead className="font-semibold text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center bg-background/50"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">₹{item.price}</TableCell>
                      <TableCell className="text-right font-bold text-primary">₹{item.price * item.quantity}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-8 space-y-6">
              {/* Customer Information Form */}
              <Card className="shadow-glow bg-card/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(handleGenerateBill)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Customer Name *
                        </Label>
                        <Input
                          id="name"
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Enter customer name"
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          {...register('phone', { 
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'Please enter a valid 10-digit phone number'
                            }
                          })}
                          placeholder="Enter phone number"
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address (Optional)
                      </Label>
                      <Textarea
                        id="address"
                        {...register('address')}
                        placeholder="Enter customer address"
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleNo" className="text-sm font-medium">
                          Vehicle No (Optional)
                        </Label>
                        <Input
                          id="vehicleNo"
                          {...register('vehicleNo')}
                          placeholder="Enter vehicle number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deliveryNote" className="text-sm font-medium">
                          Delivery Note (Optional)
                        </Label>
                        <Input
                          id="deliveryNote"
                          {...register('deliveryNote')}
                          placeholder="Enter any delivery notes"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <div className="flex-1">
                        <div className="bg-gradient-ambient p-4 rounded-lg shadow-glow border border-primary/20">
                          <div className="text-center sm:text-right">
                            <p className="text-lg font-semibold text-foreground">
                              TOTAL AMOUNT: <span className="text-primary text-2xl">₹{totalAmount}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        variant="ice"
                        className="font-semibold px-8 py-3"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate Bill
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;