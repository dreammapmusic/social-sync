import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { DataService } from '../lib/dataService';

const Login = ({ setIsAuthenticated, setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.password.length < 4) {
        throw new Error('Password must be at least 4 characters long');
      }

      // Use the real backend API
      const dataServiceInstance = new DataService();
      const result = await dataServiceInstance.login(formData.email, formData.password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${result.user.name || result.user.email}.`,
        });
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo and title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full social-gradient mb-4"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold gradient-text mb-2">SocialSync</h1>
              <p className="text-gray-400">Schedule your social media success</p>
            </div>

            <Card className="glass-effect border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full social-gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">Demo Access</h3>
                  <p className="text-xs text-gray-400 mb-2">
                    You can log in with any email and password combination (password must be at least 4 characters).
                  </p>
                  <p className="text-xs text-gray-500">
                    Try: demo@example.com / password
                  </p>
                </div>
              </CardContent>
            </Card>

            <motion.p 
              className="text-center text-sm text-gray-500 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Don't have an account? 
              <Button 
                variant="link" 
                className="text-blue-400 hover:text-blue-300 p-0 ml-1"
                onClick={() => toast({
                  title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                })}
              >
                Request Signup
              </Button>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;