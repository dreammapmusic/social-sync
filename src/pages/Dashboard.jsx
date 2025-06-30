import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Edit,
  Trash2,
  FileText,
  Activity,
  Target,
  Zap,
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import CreatePostModal from '@/components/CreatePostModal';
import DraggableWidget from '@/components/ui/draggable-widget';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTheme } from '@/contexts/ThemeContext';
import dataService from '@/lib/dataService';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    totalReach: 0
  });

  const { widgets, getVisibleWidgets, dashboardLayout, customizationMode } = useDashboard();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load posts and drafts from API
      const [allPosts, allDrafts] = await Promise.all([
        dataService.getPosts(),
        dataService.getDrafts()
      ]);
      
      setPosts(allPosts);
      setDrafts(allDrafts);
      
      const scheduled = allPosts.filter(post => post.status === 'scheduled').length;
      const published = allPosts.filter(post => post.status === 'published').length;
      
      setStats({
        totalPosts: allPosts.length,
        scheduledPosts: scheduled,
        publishedPosts: published,
        totalReach: allPosts.length > 0 ? Math.floor(Math.random() * 50000) + 25000 : 0
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ 
        title: "Error loading data", 
        description: "Please check your backend connection.", 
        variant: "destructive" 
      });
    }
  };

  const handleSavePost = async (postData, status) => {
    try {
      await dataService.savePost(postData, status);
      
      toast({ 
        title: status === 'scheduled' ? "Post scheduled successfully!" : "Draft saved!" 
      });

      setShowCreateModal(false);
      setEditingPost(null);
      loadData();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ 
        title: "Error saving post", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await dataService.deletePost(postId);
      toast({ title: "Post deleted" });
      loadData();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ 
        title: "Error deleting post", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteDraft = async (draftId) => {
    try {
      await dataService.deletePost(draftId);
      toast({ title: "Draft deleted" });
      loadData();
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({ 
        title: "Error deleting draft", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowCreateModal(true);
  };

  const getPlatformIcon = (platform) => {
    const icons = { facebook: Facebook, instagram: Instagram, twitter: Twitter, linkedin: Linkedin, youtube: Youtube };
    const Icon = icons[platform] || Users;
    return <Icon className="h-4 w-4 text-white" />;
  };

  const getPlatformColor = (platform) => {
    const colors = { facebook: 'facebook-gradient', instagram: 'instagram-gradient', twitter: 'twitter-gradient', linkedin: 'linkedin-gradient', youtube: 'youtube-gradient' };
    return colors[platform] || 'social-gradient';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'scheduled': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'published': 'bg-green-500/20 text-green-400 border-green-500/30',
      'draft': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'failed': 'bg-red-500/20 text-red-400 border-red-500/30',
      'pending': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Widget Components
  const StatsOverviewWidget = ({ widget }) => (
    <DraggableWidget widget={widget}>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
          <div className="text-xs text-gray-400">Total Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.scheduledPosts}</div>
          <div className="text-xs text-gray-400">Scheduled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.publishedPosts}</div>
          <div className="text-xs text-gray-400">Published</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalReach.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Total Reach</div>
        </div>
      </div>
    </DraggableWidget>
  );

  const RecentPostsWidget = ({ widget }) => {
    const recentPosts = posts.slice(-3).reverse();
    
    return (
      <DraggableWidget widget={widget}>
        <div className="space-y-3">
          {recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No recent posts</p>
            </div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
            {post.platforms.map((platform) => (
                      <div key={platform} className={`h-4 w-4 rounded ${getPlatformColor(platform)} flex items-center justify-center`}>
                {getPlatformIcon(platform)}
              </div>
            ))}
          </div>
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(post.status)}`}>
              {post.status}
            </Badge>
                </div>
                <p className="text-white text-sm font-medium truncate">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </DraggableWidget>
    );
  };

  const QuickActionsWidget = ({ widget }) => (
    <DraggableWidget widget={widget}>
      <div className="space-y-3">
        <Button 
          onClick={() => { setEditingPost(null); setShowCreateModal(true); }}
          className="w-full social-gradient"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-white/10 text-white hover:bg-white/5 hover:text-white"
          size="sm"
          onClick={() => navigate('/calendar')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-white/10 text-white hover:bg-white/5 hover:text-white"
          size="sm"
          onClick={() => navigate('/analytics')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>
    </DraggableWidget>
  );

  const AnalyticsPreviewWidget = ({ widget }) => {
    // Generate dynamic mock analytics data
    const mockAnalytics = {
      impressions: Math.floor(Math.random() * 3000) + 1500, // 1.5K - 4.5K
      engagements: Math.floor(Math.random() * 300) + 150,   // 150 - 450
      growth: (Math.random() > 0.3 ? '+' : '-') + (Math.random() * 20 + 5).toFixed(1) + '%'
    };
    
    const isPositiveGrowth = mockAnalytics.growth.startsWith('+');
    
    return (
      <DraggableWidget widget={widget}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${isPositiveGrowth ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-sm text-gray-400">This Week</span>
            </div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${isPositiveGrowth ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
            >
              {mockAnalytics.growth}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{(mockAnalytics.impressions / 1000).toFixed(1)}K</div>
              <div className="text-xs text-gray-400">Impressions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{mockAnalytics.engagements}</div>
              <div className="text-xs text-gray-400">Engagements</div>
            </div>
          </div>
        </div>
      </DraggableWidget>
    );
  };

  const CalendarPreviewWidget = ({ widget }) => {
    const upcomingPosts = posts.filter(post => post.status === 'scheduled').slice(0, 3);
    
    return (
      <DraggableWidget widget={widget}>
        <div className="space-y-3">
          {upcomingPosts.length === 0 ? (
            <div className="text-center py-4">
              <Calendar className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No upcoming posts</p>
            </div>
          ) : (
            upcomingPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-2 rounded bg-white/5">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{post.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DraggableWidget>
    );
  };

  const PlatformStatusWidget = ({ widget }) => {
    const platforms = [
      { name: 'Facebook', icon: Facebook, status: 'connected', color: 'bg-blue-600' },
      { name: 'Instagram', icon: Instagram, status: 'connected', color: 'bg-purple-600' },
      { name: 'Twitter', icon: Twitter, status: 'connected', color: 'bg-sky-500' },
      { name: 'LinkedIn', icon: Linkedin, status: 'disconnected', color: 'bg-blue-700' },
      { name: 'YouTube', icon: Youtube, status: 'connected', color: 'bg-red-600' },
    ];
    
    return (
      <DraggableWidget widget={widget}>
        <div className="space-y-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.name} className="flex items-center justify-between p-2 rounded bg-white/5">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded ${platform.color} flex items-center justify-center`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-white">{platform.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {platform.status === 'connected' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DraggableWidget>
    );
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'stats':
        return <StatsOverviewWidget key={widget.id} widget={widget} />;
      case 'posts':
        return <RecentPostsWidget key={widget.id} widget={widget} />;
      case 'actions':
        return <QuickActionsWidget key={widget.id} widget={widget} />;
      case 'analytics':
        return <AnalyticsPreviewWidget key={widget.id} widget={widget} />;
      case 'calendar':
        return <CalendarPreviewWidget key={widget.id} widget={widget} />;
      case 'platforms':
        return <PlatformStatusWidget key={widget.id} widget={widget} />;
      default:
        return null;
    }
  };

  const getLayoutClasses = () => {
    switch (dashboardLayout) {
      case 'list':
        return 'grid grid-cols-1 gap-6';
      case 'compact':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
      default: // grid
        return 'dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min';
    }
  };

  const visibleWidgets = getVisibleWidgets();

  return (
    <>
      <Helmet>
        <title>Dashboard - SocialSync</title>
        <meta name="description" content="Manage your social media posts and view analytics from your SocialSync dashboard." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your social media presence
            </p>
          </div>
          
          {!customizationMode && (
            <Button 
              onClick={() => { setEditingPost(null); setShowCreateModal(true); }} 
              className="social-gradient"
            >
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
          )}
        </div>

        {customizationMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border-2 border-dashed ${
              isDark ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-400/50 bg-blue-400/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-400" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Customization Mode Active
              </h3>
                    </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Drag widgets to rearrange them, hide/show widgets, or reset to default layout. 
              Click "Done" when you're finished customizing.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={dashboardLayout}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={getLayoutClasses()}
          >
            {visibleWidgets.map(renderWidget)}
            </motion.div>
        </AnimatePresence>

        {visibleWidgets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>📊</div>
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No widgets visible
            </h3>
            <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              All dashboard widgets are currently hidden. Enable customization mode to show widgets.
            </p>
          </motion.div>
        )}
                    </div>

        <CreatePostModal
          isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
          onSave={handleSavePost}
          postToEdit={editingPost}
        />
    </>
  );
};

export default Dashboard;