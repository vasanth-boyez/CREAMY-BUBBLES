import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import creamyBubbleLogo from '@/assets/creamy-bubble-logo.png';
import { IceCream } from 'lucide-react';

const emailSchema = z.string().trim().email({ message: "Invalid email address" });
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'staff'>('staff');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message || "Invalid email or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back to Sri Karthikeya Frozen Foods!",
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, role);
        if (error) {
          if (error.message?.includes('already registered')) {
            toast({
              title: "Account Already Exists",
              description: "This email is already registered. Please login instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Signup Failed",
              description: error.message || "Failed to create account",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account Created",
            description: "Welcome to Sri Karthikeya Frozen Foods! Logging you in...",
          });
          // Auto login after signup
          await signIn(email, password);
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-glow flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-ambient bg-card/80 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={creamyBubbleLogo} 
              alt="Sri Karthikeya Frozen Foods" 
              className="h-20 w-auto drop-shadow-glow"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Sri Karthikeya Frozen Foods</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ice Cream Shop Management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" variant="ice" className="w-full" disabled={loading}>
                  <IceCream className="mr-2 h-4 w-4" />
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Select Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={role === 'staff' ? 'ice' : 'outline'}
                      onClick={() => setRole('staff')}
                      disabled={loading}
                      className="w-full"
                    >
                      Staff
                    </Button>
                    <Button
                      type="button"
                      variant={role === 'owner' ? 'ice' : 'outline'}
                      onClick={() => setRole('owner')}
                      disabled={loading}
                      className="w-full"
                    >
                      Owner
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {role === 'owner' ? 'Manage products and generate bills' : 'Generate bills only'}
                  </p>
                </div>
                <Button type="submit" variant="ice" className="w-full" disabled={loading}>
                  <IceCream className="mr-2 h-4 w-4" />
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
