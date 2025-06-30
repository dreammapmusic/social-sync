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
      setAnalytics(analyticsData.analytics || generateEnhancedMockData());
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback to mock data on error
      generateEnhancedMockData();
      toast({
        title: "Analytics Loading Error",
        description: "Using demo data. Check your backend connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnhancedMockData = () => {
    const baseMultiplier = timeRange === '7d' ? 1 : timeRange === '30d' ? 4 : 12;
    
    const mockData = {
      overview: {
        totalReach: Math.floor((Math.random() * 50000 + 25000) * baseMultiplier),
        totalEngagement: Math.floor((Math.random() * 8000 + 4000) * baseMultiplier),
        totalLikes: Math.floor((Math.random() * 6000 + 3000) * baseMultiplier),
        totalComments: Math.floor((Math.random() * 800 + 400) * baseMultiplier),
        totalShares: Math.floor((Math.random() * 600 + 300) * baseMultiplier),
        totalViews: Math.floor((Math.random() * 120000 + 60000) * baseMultiplier),
        followerGrowth: Math.floor(Math.random() * 500 + 100) * baseMultiplier,
        engagementRate: (Math.random() * 3 + 2).toFixed(2),
      },
      
      platformBreakdown: {
        facebook: {
          reach: Math.floor((Math.random() * 15000 + 8000) * baseMultiplier),
          engagement: Math.floor((Math.random() * 2000 + 1000) * baseMultiplier),
          growth: Math.random() > 0.3 ? '+' + (Math.random() * 15 + 5).toFixed(1) + '%' : '-' + (Math.random() * 5 + 1).toFixed(1) + '%',
          posts: Math.floor(Math.random() * 20 + 10),
          followers: Math.floor((Math.random() * 25000 + 15000) * baseMultiplier),
        },
        instagram: {
          reach: Math.floor((Math.random() * 20000 + 12000) * baseMultiplier),
          engagement: Math.floor((Math.random() * 3000 + 1500) * baseMultiplier),
          growth: Math.random() > 0.2 ? '+' + (Math.random() * 20 + 8).toFixed(1) + '%' : '-' + (Math.random() * 3 + 1).toFixed(1) + '%',
          posts: Math.floor(Math.random() * 25 + 15),
          followers: Math.floor((Math.random() * 35000 + 20000) * baseMultiplier),
        },
        twitter: {
          reach: Math.floor((Math.random() * 12000 + 6000) * baseMultiplier),
          engagement: Math.floor((Math.random() * 1500 + 800) * baseMultiplier),
          growth: Math.random() > 0.4 ? '+' + (Math.random() * 12 + 3).toFixed(1) + '%' : '-' + (Math.random() * 8 + 2).toFixed(1) + '%',
          posts: Math.floor(Math.random() * 30 + 20),
          followers: Math.floor((Math.random() * 18000 + 10000) * baseMultiplier),
        },
        linkedin: {
          reach: Math.floor((Math.random() * 8000 + 4000) * baseMultiplier),
          engagement: Math.floor((Math.random() * 1200 + 600) * baseMultiplier),
          growth: Math.random() > 0.6 ? '+' + (Math.random() * 18 + 7).toFixed(1) + '%' : '-' + (Math.random() * 4 + 1).toFixed(1) + '%',
          posts: Math.floor(Math.random() * 15 + 8),
          followers: Math.floor((Math.random() * 12000 + 8000) * baseMultiplier),
        },
        youtube: {
          reach: Math.floor((Math.random() * 25000 + 15000) * baseMultiplier),
          engagement: Math.floor((Math.random() * 2500 + 1200) * baseMultiplier),
          growth: Math.random() > 0.5 ? '+' + (Math.random() * 25 + 10).toFixed(1) + '%' : '-' + (Math.random() * 6 + 2).toFixed(1) + '%',
          posts: Math.floor(Math.random() * 8 + 3),
          followers: Math.floor((Math.random() * 45000 + 25000) * baseMultiplier),
        },
      },
      
      timeSeriesData: generateTimeSeriesData(timeRange),
      
      topPosts: [
        {
          id: 1,
          content: "🚀 Exciting product launch announcement! Our new AI-powered analytics dashboard is now live and helping businesses grow their social presence...",
          platform: ['instagram', 'facebook', 'twitter'],
          reach: Math.floor(Math.random() * 15000 + 8000),
          likes: Math.floor(Math.random() * 800 + 400),
          comments: Math.floor(Math.random() * 120 + 60),
          shares: Math.floor(Math.random() * 200 + 100),
          engagementRate: (Math.random() * 4 + 3).toFixed(2),
          postedAt: '2024-01-15',
        },
        {
          id: 2,
          content: "Behind the scenes: Team building day! 👥 Amazing collaboration and creativity from our incredible team. Here's what we learned...",
          platform: ['linkedin', 'instagram'],
          reach: Math.floor(Math.random() * 12000 + 6000),
          likes: Math.floor(Math.random() * 600 + 300),
          comments: Math.floor(Math.random() * 80 + 40),
          shares: Math.floor(Math.random() * 150 + 75),
          engagementRate: (Math.random() * 3 + 2.5).toFixed(2),
          postedAt: '2024-01-14',
        },
        {
          id: 3,
          content: "Quick tip Tuesday: 5 ways to boost your productivity 💡 Save this post for later and implement these strategies today!",
          platform: ['twitter', 'linkedin'],
          reach: Math.floor(Math.random() * 10000 + 5000),
          likes: Math.floor(Math.random() * 500 + 250),
          comments: Math.floor(Math.random() * 60 + 30),
          shares: Math.floor(Math.random() * 180 + 90),
          engagementRate: (Math.random() * 3.5 + 2).toFixed(2),
          postedAt: '2024-01-13',
        },
        {
          id: 4,
          content: "Customer success story: How @TechStartup increased their social engagement by 150% using our platform! 📈",
          platform: ['facebook', 'linkedin', 'twitter'],
          reach: Math.floor(Math.random() * 18000 + 9000),
          likes: Math.floor(Math.random() * 900 + 450),
          comments: Math.floor(Math.random() * 140 + 70),
          shares: Math.floor(Math.random() * 250 + 125),
          engagementRate: (Math.random() * 4.5 + 3.5).toFixed(2),
          postedAt: '2024-01-12',
        },
        {
          id: 5,
          content: "Weekend vibes ✨ What's your favorite way to unwind after a productive week? Share in the comments below!",
          platform: ['instagram', 'facebook'],
          reach: Math.floor(Math.random() * 8000 + 4000),
          likes: Math.floor(Math.random() * 400 + 200),
          comments: Math.floor(Math.random() * 50 + 25),
          shares: Math.floor(Math.random() * 80 + 40),
          engagementRate: (Math.random() * 2.5 + 1.5).toFixed(2),
          postedAt: '2024-01-11',
        },
      ],
      
      insights: [
        {
          type: 'positive',
          icon: TrendingUp,
          title: 'Best Performing Day',
          description: 'Tuesday posts get 34% more engagement than average',
          recommendation: 'Schedule more high-impact content on Tuesdays'
        },
        {
          type: 'neutral',
          icon: Clock,
          title: 'Optimal Posting Time',
          description: '2:00 PM - 4:00 PM shows highest reach across all platforms',
          recommendation: 'Focus posting during peak afternoon hours'
        },
        {
          type: 'positive',
          icon: Award,
          title: 'Top Content Type',
          description: 'Educational and how-to posts perform 28% better',
          recommendation: 'Create more tutorial and tip-based content'
        },
        {
          type: 'warning',
          icon: TrendingDown,
          title: 'Weekend Engagement',
          description: 'Weekend posts show 15% lower engagement rates',
          recommendation: 'Consider reducing weekend posting frequency'
        },
        {
          type: 'positive',
          icon: Target,
          title: 'Video Content Success',
          description: 'Video posts generate 45% more shares than images',
          recommendation: 'Increase video content production'
        },
        {
          type: 'neutral',
          icon: Users,
          title: 'Audience Growth',
          description: 'Consistent posting leads to 12% faster follower growth',
          recommendation: 'Maintain regular posting schedule'
        },
      ],
      
      demographics: {
        ageGroups: [
          { label: '18-24', value: 22, color: 'bg-blue-500' },
          { label: '25-34', value: 35, color: 'bg-green-500' },
          { label: '35-44', value: 28, color: 'bg-yellow-500' },
          { label: '45-54', value: 12, color: 'bg-purple-500' },
          { label: '55+', value: 3, color: 'bg-pink-500' },
        ],
        locations: [
          { country: 'United States', percentage: 45 },
          { country: 'United Kingdom', percentage: 18 },
          { country: 'Canada', percentage: 12 },
          { country: 'Australia', percentage: 8 },
          { country: 'Germany', percentage: 7 },
          { country: 'France', percentage: 4 },
          { country: 'Netherlands', percentage: 3 },
          { country: 'Others', percentage: 3 },
        ],
        genderBreakdown: [
          { label: 'Female', value: 52, color: 'bg-pink-500' },
          { label: 'Male', value: 46, color: 'bg-blue-500' },
          { label: 'Other', value: 2, color: 'bg-purple-500' },
        ],
        deviceTypes: [
          { label: 'Mobile', value: 68, color: 'bg-green-500' },
          { label: 'Desktop', value: 28, color: 'bg-blue-500' },
          { label: 'Tablet', value: 4, color: 'bg-yellow-500' },
        ]
      },
      
      competitorAnalysis: [
        {
          name: 'Competitor A',
          reach: Math.floor(Math.random() * 40000 + 20000),
          engagement: Math.floor(Math.random() * 6000 + 3000),
          growth: Math.random() > 0.5 ? '+' + (Math.random() * 10 + 2).toFixed(1) + '%' : '-' + (Math.random() * 5 + 1).toFixed(1) + '%',
        },
        {
          name: 'Competitor B',
          reach: Math.floor(Math.random() * 35000 + 18000),
          engagement: Math.floor(Math.random() * 5500 + 2500),
          growth: Math.random() > 0.4 ? '+' + (Math.random() * 8 + 1).toFixed(1) + '%' : '-' + (Math.random() * 4 + 1).toFixed(1) + '%',
        },
        {
          name: 'Competitor C',
          reach: Math.floor(Math.random() * 30000 + 15000),
          engagement: Math.floor(Math.random() * 4500 + 2000),
          growth: Math.random() > 0.6 ? '+' + (Math.random() * 12 + 3).toFixed(1) + '%' : '-' + (Math.random() * 6 + 2).toFixed(1) + '%',
        },
      ]
    };

    setAnalytics(mockData);
  };

  const generateTimeSeriesData = (range) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        reach: Math.floor(Math.random() * 5000 + 2000),
        engagement: Math.floor(Math.random() * 800 + 300),
        followers: Math.floor(Math.random() * 50 + 10),
        impressions: Math.floor(Math.random() * 8000 + 4000),
      });
    }
    
    return data;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: Facebook,
      instagram: Instagram,
      twitter: Twitter,
      linkedin: Linkedin,
      youtube: Youtube
    };
    return icons[platform];
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
                    <p className="text-2xl font-bold text-white">+{analytics.overview.followerGrowth.toLocaleString()}</p>
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
                      <p className="text-xl font-bold text-white">{analytics.overview.totalLikes.toLocaleString()}</p>
                      <p className="text-xs text-green-400">+18.2%</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Comments</p>
                      <p className="text-xl font-bold text-white">{analytics.overview.totalComments.toLocaleString()}</p>
                      <p className="text-xs text-green-400">+22.7%</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Share className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Shares</p>
                      <p className="text-xl font-bold text-white">{analytics.overview.totalShares.toLocaleString()}</p>
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
                  {Object.entries(analytics.platformBreakdown).map(([platform, data]) => {
                    const Icon = getPlatformIcon(platform);
                    const isPositiveGrowth = data.growth.startsWith('+');
                    
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
                            <span className="text-sm font-medium text-white">{data.reach.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Engagement</span>
                            <span className="text-sm font-medium text-white">{data.engagement.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Followers</span>
                            <span className="text-sm font-medium text-white">{data.followers.toLocaleString()}</span>
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
                  {analytics.topPosts.map((post, index) => (
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
                              {post.platform.map((platform) => {
                                const Icon = getPlatformIcon(platform);
                                return (
                                  <div key={platform} className={`h-6 w-6 rounded ${getPlatformColor(platform)} flex items-center justify-center`}>
                                    <Icon className="h-3 w-3 text-white" />
                                </div>
                                );
                              })}
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
                    {analytics.demographics.ageGroups.map((group, index) => (
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
                    {analytics.demographics.locations.map((location, index) => (
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
                    {analytics.demographics.genderBreakdown.map((group, index) => (
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
                    {analytics.demographics.deviceTypes.map((device, index) => (
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
                  {analytics.competitorAnalysis.map((competitor, index) => (
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
                  {analytics.insights.map((insight, index) => {
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