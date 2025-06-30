import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap,
  Folder,
  Edit3,
  Save,
  RefreshCw,
  Layout as LayoutIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTheme } from '@/contexts/ThemeContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Files', href: '/files', icon: Folder },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Layout = ({ children, user, setUser:_setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { customizationMode, toggleCustomizationMode, resetDashboard, dashboardLayout, setDashboardLayout } = useDashboard();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    _setUser(null);
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate('/login');
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full glass-effect"
        style={{
          borderBottom: `1px solid hsl(${isDark ? 'var(--border-default)' : 'var(--border-subtle)'})`
        }}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-black p-2 rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">SocialSync</span>
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`text-sm font-medium transition-colors text-muted-foreground hover:text-foreground ${
                        isActive ? "!text-foreground" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Dashboard Customization Controls */}
              {location.pathname === '/dashboard' && (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant={customizationMode ? "default" : "ghost"}
                    size="sm"
                    onClick={toggleCustomizationMode}
                    className={customizationMode ? "bg-accent" : ""}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {customizationMode ? 'Done' : 'Customize'}
                  </Button>
                  
                  {customizationMode && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <LayoutIcon className="h-4 w-4 mr-2" />
                            Layout
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={() => setDashboardLayout('grid')}
                            className={dashboardLayout === 'grid' ? 'bg-accent' : ''}
                          >
                            Grid View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setDashboardLayout('list')}
                            className={dashboardLayout === 'list' ? 'bg-accent' : ''}
                          >
                            List View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setDashboardLayout('compact')}
                            className={dashboardLayout === 'compact' ? 'bg-accent' : ''}
                          >
                            Compact View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          resetDashboard();
                          toast({
                            title: "Dashboard Reset",
                            description: "Your dashboard has been reset to default layout.",
                          });
                        }}
                        className="text-gray-300 hover:text-white"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${user?.email}`} alt={user?.name} />
                      <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-effect border-white/10 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-gray-400">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onSelect={() => navigate('/settings')} className="cursor-pointer hover:!bg-white/5 focus:bg-white/5">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-400 hover:!bg-red-500/10 hover:!text-red-400 focus:bg-red-500/10 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col px-4 pt-2 pb-4 space-y-1 border-t border-white/10">
                {navigation.map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;