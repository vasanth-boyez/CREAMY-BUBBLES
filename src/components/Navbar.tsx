import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import creamyBubbleLogo from '@/assets/creamy-bubble-logo.png';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { signOut, userRole } = useAuth();
  const totalItems = getTotalItems();

  return (
    <nav className="bg-gradient-soft backdrop-blur-xl border-b-4 border-candy-pink shadow-ambient sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer hover:scale-105 transition-bounce"
            onClick={() => navigate('/')}
          >
            <img 
              src={creamyBubbleLogo} 
              alt="Creamy Bubble's Logo" 
              className="h-16 w-16 object-cover rounded-full drop-shadow-glow border-2 border-candy-pink"
            />
            <div>
              <h1 className="text-3xl font-black bg-gradient-candy bg-clip-text text-transparent drop-shadow-glow animate-glow-pulse">
                SRI KARTHIKEYA FROZEN FOODS
              </h1>
              <p className="text-sm font-bold text-candy-purple">🍦 Ice Creams 🍦</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={location.pathname === '/' ? 'ice' : 'ghost'}
              onClick={() => navigate('/')}
              className="font-semibold text-base"
            >
              🍦 Menu
            </Button>

            <Button
              variant={location.pathname === '/discount-50' ? 'ice' : 'ghost'}
              onClick={() => navigate('/discount-50')}
              className="font-semibold text-base"
            >
              50%
            </Button>

            <Button
              variant={location.pathname === '/discount-30' ? 'ice' : 'ghost'}
              onClick={() => navigate('/discount-30')}
              className="font-semibold text-base"
            >
              30%
            </Button>
            
            {userRole === 'owner' && (
              <Button
                variant={location.pathname === '/owner-panel' ? 'ice' : 'ghost'}
                onClick={() => navigate('/owner-panel')}
                className="font-semibold text-base"
              >
                <Settings className="mr-2 h-5 w-5" />
                Manage
              </Button>
            )}
            
            <Button
              variant="cart"
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background shadow-glow">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={signOut}
              className="font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;