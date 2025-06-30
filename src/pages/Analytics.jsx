import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Heart, 
  MessageCircle, 
  Share, 
  Eye, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Award,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import dataService from '@/lib/dataService';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, selectedPlatform]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const analyticsData = await dataService.getAnalytics(timeRange);
      if (!analyticsData || !analyticsData.analytics) {
        throw new Error('No analytics data available');
      }
      setAnalytics(analyticsData.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Analytics Loading Error",
        description: "Unable to load analytics data. Please check your backend connection.",
        variant: "destructive"
      });
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: Facebook,
      instagram: Instagram,
      twitter: Twitter,
      linkedin: Linkedin,
      youtube: Youtube
    };
    return icons[platform] || Users;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: 'bg-blue-600',
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      twitter: 'bg-sky-500',
      linkedin: 'bg-blue-700',
      youtube: 'bg-red-600'
    };
    return colors[platform] || 'bg-gray-500';
  };

  const calculateGrowthPercentage = (current, previous) => {
    if (!previous) return '+0.0%';
    const growth = ((current - previous) / previous) * 100;
    return growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  const SimpleBarChart = ({ data, color = 'bg-blue-500' }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="flex items-end space-x-1 h-24">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full ${color} rounded-t`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
            <span className="text-xs text-gray-400 mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const CircularProgress = ({ percentage, color = 'stroke-blue-500' }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-white">{percentage}%</span>
        </div>
      </div>
    );
  };

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const platformBreakdown = analytics.platformBreakdown || {};
  const topPosts = analytics.topPosts || [];
  const demographics = analytics.demographics || { ageGroups: [], locations: [], genderBreakdown: [], deviceTypes: [] };
  const deviceTypes = demographics.deviceTypes || [];
  const competitorAnalysis = analytics.competitorAnalysis || [];
  const insightsData = analytics.insights || [];

  return (
    <>
      <Helmet>
        <title>Enhanced Analytics - SocialSync</title>
        <meta name="description" content="Comprehensive analytics and insights for your social media performance." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Enhanced Analytics</h1>
            <p className="text-gray-400 mt-1">Comprehensive insights into your social media performance</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button
              variant="outline"
              className="border-white/10 text-gray-300 hover:bg-white/5"
              onClick={() => toast({
                title: "✨ Report Export Ready!",
                description: "Your analytics report is being prepared...",
              })}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Reach</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview.totalReach.toLocaleString()}</p>
                                          <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.5% vs last period
                      </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Engagement</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview.totalEngagement.toLocaleString()}</p>
                                          <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.3% vs last period
                      </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Engagement Rate</p>
                    <p className="text-2xl font-bold text-white">{analytics.overview.engagementRate}%</p>
                                          <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.1% vs last period
                      </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Follower Growth</p>
                    <p className="text-2xl font-bold text-white">+{(analytics.overview?.followerGrowth ?? 0).toLocaleString()}</p>
                                          <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15.7% vs last period
                      </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 bg-white/5 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-white/10">Platforms</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-white/10">Content</TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-white/10">Audience</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white/10">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
        {/* Engagement Breakdown */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Engagement Breakdown
                </CardTitle>
              <CardDescription className="text-gray-400">
                Detailed engagement metrics across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Likes</p>
                      <p className="text-xl font-bold text-white">{(analytics.overview?.totalLikes ?? 0).toLocaleString()}</p>
                      <p className="text-xs text-green-400">+18.2%</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Comments</p>
                      <p className="text-xl font-bold text-white">{(analytics.overview?.totalComments ?? 0).toLocaleString()}</p>
                      <p className="text-xs text-green-400">+22.7%</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Share className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Shares</p>
                      <p className="text-xl font-bold text-white">{(analytics.overview?.totalShares ?? 0).toLocaleString()}</p>
                      <p className="text-xs text-green-400">+14.3%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Performance Trend */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Trend
                </CardTitle>
              <CardDescription className="text-gray-400">
                  Daily performance metrics over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-4">Daily Reach</h4>
                      <SimpleBarChart 
                        data={analytics.timeSeriesData.slice(-7).map((d, i) => ({ 
                          label: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }), 
                          value: d.reach 
                        }))}
                        color="bg-blue-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-4">Daily Engagement</h4>
                      <SimpleBarChart 
                        data={analytics.timeSeriesData.slice(-7).map((d, i) => ({ 
                          label: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }), 
                          value: d.engagement 
                        }))}
                        color="bg-green-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Platform Performance</CardTitle>
                <CardDescription className="text-gray-400">
                  Compare performance across all connected platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(platformBreakdown).map(([platform, data]) => {
                    const Icon = getPlatformIcon(platform);
                    const isPositiveGrowth = typeof data.growth === 'string' && data.growth.startsWith('+');
                    
                    return (
                      <motion.div
                        key={platform}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-lg ${getPlatformColor(platform)} flex items-center justify-center`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-white font-semibold capitalize">{platform}</h3>
                          </div>
                          <Badge 
                            variant={isPositiveGrowth ? 'default' : 'destructive'}
                            className={isPositiveGrowth ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                          >
                            {data.growth}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Reach</span>
                            <span className="text-sm font-medium text-white">{(data.reach ?? 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Engagement</span>
                            <span className="text-sm font-medium text-white">{(data.engagement ?? 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Followers</span>
                            <span className="text-sm font-medium text-white">{(data.followers ?? 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Posts</span>
                            <span className="text-sm font-medium text-white">{data.posts}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Your best performing posts from the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                      <div className="flex items-start justify-between">
                          <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex gap-2">
                              {Array.isArray(post.platform) ? post.platform.map((platform) => {
                                const Icon = getPlatformIcon(platform);
                                return (
                                  <div key={platform} className={`h-6 w-6 rounded ${getPlatformColor(platform)} flex items-center justify-center`}>
                                    <Icon className="h-3 w-3 text-white" />
                                </div>
                                );
                              }) : null}
                            </div>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              {post.engagementRate}% engagement
                            </Badge>
                          </div>
                          <p className="text-white font-medium mb-3">{post.content}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.reach.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share className="h-4 w-4" />
                              {post.shares}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">{new Date(post.postedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Age Demographics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Age distribution of your audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demographics.ageGroups.map((group, index) => (
                      <div key={group.label} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-gray-400">{group.label}</div>
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${group.color}`}
                            style={{ width: `${group.value}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-white text-right">{group.value}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Top Locations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Geographic distribution of your audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {demographics.locations.map((location, index) => (
                      <div key={location.country} className="flex items-center justify-between">
                        <span className="text-white text-sm">{location.country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${location.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-8">{location.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Gender Distribution</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gender breakdown of your audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demographics.genderBreakdown.map((group, index) => (
                      <div key={group.label} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-gray-400">{group.label}</div>
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${group.color}`}
                            style={{ width: `${group.value}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-white text-right">{group.value}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Device Usage</CardTitle>
                  <CardDescription className="text-gray-400">
                    How your audience accesses your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceTypes.map((device, index) => (
                      <div key={device.label} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-gray-400">{device.label}</div>
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${device.color}`}
                            style={{ width: `${device.value}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-white text-right">{device.value}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Competitor Analysis Section */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Competitive Analysis
                </CardTitle>
                <CardDescription className="text-gray-400">
                  How your performance compares to competitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {competitorAnalysis.map((competitor, index) => (
                    <motion.div
                      key={competitor.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">{competitor.name}</h3>
                        <Badge 
                          variant={competitor.growth.startsWith('+') ? 'default' : 'destructive'}
                          className={competitor.growth.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                        >
                          {competitor.growth}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Reach</span>
                          <span className="text-sm font-medium text-white">{competitor.reach.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Engagement</span>
                          <span className="text-sm font-medium text-white">{competitor.engagement.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">vs. You</span>
                          <span className={`text-sm font-medium ${competitor.reach > analytics.overview.totalReach ? 'text-red-400' : 'text-green-400'}`}>
                            {competitor.reach > analytics.overview.totalReach ? '−' : '+'}{Math.abs(((analytics.overview.totalReach - competitor.reach) / competitor.reach) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI-Powered Insights & Recommendations
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Smart recommendations to improve your social media performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insightsData.map((insight, index) => {
                    const Icon = insight.icon;
                    const colorClasses = {
                      positive: 'border-green-500/20 bg-green-500/10',
                      neutral: 'border-blue-500/20 bg-blue-500/10',
                      warning: 'border-yellow-500/20 bg-yellow-500/10'
                    };
                    
                    const iconColors = {
                      positive: 'text-green-400',
                      neutral: 'text-blue-400',
                      warning: 'text-yellow-400'
                    };
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${colorClasses[insight.type]}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-white/10`}>
                            <Icon className={`h-5 w-5 ${iconColors[insight.type]}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-1">{insight.title}</h4>
                            <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                            <p className="text-xs text-gray-400 italic">{insight.recommendation}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Analytics;