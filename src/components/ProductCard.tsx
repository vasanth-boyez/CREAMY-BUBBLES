import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import IceCream3D from './IceCream3D';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    icon_url?: string | null;
  };
}

const getColorFromName = (name: string): string => {
  const colors: { [key: string]: string } = {
    vanilla: '#F3E5AB',
    chocolate: '#7B3F00',
    strawberry: '#FC5A8D',
    mango: '#FFC107',
    butterscotch: '#E8AA42',
    mint: '#98D8C8',
    cookie: '#8B4513',
    pistachio: '#93C572',
    black: '#4A235A',
    caramel: '#C68642',
  };

  const nameLower = name.toLowerCase();
  for (const key in colors) {
    if (nameLower.includes(key)) {
      return colors[key];
    }
  }
  return '#FF6B9D'; // default pink
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
    setQuantity(1);
  };

  const color = getColorFromName(product.name);

  return (
    <Card className="h-full flex flex-col shadow-emboss hover:shadow-ambient transition-all duration-300 hover:scale-105 bg-gradient-soft backdrop-blur-xl border-4 border-candy-blue/30 rounded-3xl overflow-hidden animate-bounce-in hover:border-candy-blue/60 hover:shadow-2xl">
      <CardHeader className="pb-3 bg-gradient-glow">
        <CardTitle className="text-2xl font-black text-candy-purple text-center drop-shadow-md bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
          {product.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center items-center gap-4">
        {/* 3D Ice Cream Model */}
        <div className="w-full h-32 relative">
          <Suspense fallback={<div className="text-4xl text-center">🍦</div>}>
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color="#B4D4FF" />
              <IceCream3D color={color} />
            </Canvas>
          </Suspense>
        </div>
        
        <div className="text-4xl font-black text-candy-pink drop-shadow-glow animate-glow-pulse bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent shadow-lg p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          ₹{product.price}
        </div>
        
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur rounded-3xl p-3 border-2 border-candy-blue/30 shadow-soft">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 text-center border-2 border-candy-purple bg-white rounded-2xl font-bold text-lg"
            min="1"
          />
          
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          variant="cart"
          onClick={handleAddToCart}
          className="w-full text-lg"
        >
          🛒 Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;