import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, setAuthToken } from '@/lib/api';
import { toast } from 'sonner';
import { LogIn, Unlock } from 'lucide-react';

// ============================================
// TEMPORARY AUTH BYPASS - Set to false to require credentials again
// ============================================
const ALLOW_BYPASS_LOGIN = true;
// ============================================

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if bypass is enabled and we're already "logged in"
  useEffect(() => {
    if (ALLOW_BYPASS_LOGIN) {
      const bypassToken = localStorage.getItem('adminToken');
      if (bypassToken === 'BYPASS_TOKEN_DEV_MODE') {
        navigate('/admin/products');
      }
    }
  }, [navigate]);

  const handleBypassLogin = () => {
    // Set a fake token for bypass mode
    setAuthToken('BYPASS_TOKEN_DEV_MODE');
    toast.success('Dev mode: Login bypassed!');
    navigate('/admin/products');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      setAuthToken(response.token);
      toast.success('Login successful!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Login error:', error);

      // Check if it's a network error (backend not available)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Backend API is not available. Please ensure the API server is running.');
      } else if (error instanceof Error && error.message.includes('API Error')) {
        toast.error('Invalid email or password');
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md p-8">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="logo-consol">CONSOL</span>
              <span className="logo-tech">TECH</span>
            </h1>
            <p className="text-muted-foreground">Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@consoltech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              <LogIn className="h-4 w-4" />
              <span>{isLoading ? 'Logging in...' : 'Login'}</span>
            </Button>
          </form>

          {/* BYPASS LOGIN BUTTON - Only shown when ALLOW_BYPASS_LOGIN is true */}
          {ALLOW_BYPASS_LOGIN && (
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-500/10"
                onClick={handleBypassLogin}
              >
                <Unlock className="h-4 w-4" />
                <span>Enter Admin (No Login Required)</span>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                ⚠️ Temporary dev mode - credentials disabled
              </p>
            </div>
          )}

          {!ALLOW_BYPASS_LOGIN && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Credentials:</strong><br />
                Email: admin@consoltech.com<br />
                Password: Admin123!
              </p>
            </div>
          )}

          {!ALLOW_BYPASS_LOGIN && window.location.hostname !== 'localhost' && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
                <strong>⚠️ Backend API Required:</strong><br />
                The admin area requires a deployed backend API.<br />
                Currently configured for: {import.meta.env.VITE_API_URL || 'localhost'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

