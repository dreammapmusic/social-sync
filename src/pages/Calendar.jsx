import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ChevronLeft, ChevronRight, Plus, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import CreatePostModal from '@/components/CreatePostModal';
import dataService from '@/lib/dataService';

const platformStyles = {
  facebook: {
    icon: Facebook,
    color: 'bg-blue-600',
    textColor: 'text-white',
    borderColor: 'border-blue-600',
    bgColor: 'bg-blue-600/90 border border-blue-400',
  },
  instagram: {
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-white',
    borderColor: 'border-pink-500',
    bgColor: 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 border border-pink-400',
  },
  twitter: {
    icon: Twitter,
    color: 'bg-cyan-500',
    textColor: 'text-white',
    borderColor: 'border-cyan-500',
    bgColor: 'bg-cyan-500/90 border border-cyan-400',
  },
  linkedin: {
    icon: Linkedin,
    color: 'bg-green-600',
    textColor: 'text-white',
    borderColor: 'border-green-600',
    bgColor: 'bg-green-600/90 border border-green-400',
  },
  youtube: {
    icon: Youtube,
    color: 'bg-red-600',
    textColor: 'text-white',
    borderColor: 'border-red-600',
    bgColor: 'bg-red-600/90 border border-red-400',
  },
  default: {
    icon: null,
    color: 'bg-gray-500',
    textColor: 'text-white',
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-500/90 border border-gray-400',
  }
};

const getPlatformStyle = (platform) => platformStyles[platform] || platformStyles.default;

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

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await dataService.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error loading posts",
        description: "Please check your backend connection.",
        variant: "destructive"
      });
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await dataService.savePost(postData, 'scheduled');
      
      toast({
        title: "Post scheduled successfully!",
        description: `Your post will be published on ${new Date(postData.scheduledDate).toLocaleDateString()}.`,
      });
      
      setShowCreateModal(false);
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getPlatformPostsForDate = (date) => {
    if (!date) return [];
    
    const platformPosts = [];
    posts.forEach(post => {
      const postDate = new Date(post.scheduledDate);
      if (postDate.toDateString() === date.toDateString()) {
        post.platforms.forEach(platform => {
          platformPosts.push({
            ...post,
            platform: platform,
          });
        });
      }
    });
    return platformPosts.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <Helmet>
        <title>Calendar - SocialSync</title>
        <meta name="description" content="View and manage your scheduled social media posts in calendar view." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <p className="text-gray-400 mt-1">View your scheduled posts</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="social-gradient"
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Post
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-xl text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth(-1)}
                    className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth(1)}
                    className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Platform Color Legend */}
              <div className="space-y-3 pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Platforms</h4>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(platformStyles).filter(([key]) => key !== 'default').map(([platform, style]) => {
                      const Icon = style.icon;
                      return (
                        <div key={platform} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${style.color.includes('gradient') ? style.color : style.color}`}></div>
                          <Icon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400 capitalize">{platform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { status: 'scheduled', label: 'Scheduled' },
                      { status: 'published', label: 'Published' },
                      { status: 'draft', label: 'Draft' },
                      { status: 'failed', label: 'Failed' },
                      { status: 'pending', label: 'Pending' }
                    ].map(({ status, label }) => (
                      <div key={status} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`}></div>
                        <span className="text-sm text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  const dayPlatformPosts = getPlatformPostsForDate(date);
                  const isCurrentDay = isToday(date);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                      className={`min-h-[120px] p-2 border border-white/10 rounded-lg ${
                        date ? 'bg-white/5 hover:bg-white/10' : 'bg-transparent'
                      } ${isCurrentDay ? 'ring-2 ring-blue-500/50' : ''}`}
                      onClick={() => date && setSelectedDate(date)}
                    >
                      {date && (
                        <>
                          <div className={`text-sm font-medium mb-2 text-right ${
                            isCurrentDay ? 'text-blue-400' : 'text-white'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayPlatformPosts.slice(0, 3).map(p_post => {
                              const style = getPlatformStyle(p_post.platform);
                              const Icon = style.icon;
                              return (
                                <div
                                  key={`${p_post.id}-${p_post.platform}`}
                                  className={`text-xs p-1 rounded ${style.bgColor} ${style.textColor} truncate flex items-center gap-1.5`}
                                >
                                  {Icon ? (
                                    <Icon className="h-3 w-3 flex-shrink-0" />
                                  ) : (
                                    <div className={`w-1.5 h-1.5 rounded-full ${style.color} flex-shrink-0`}></div>
                                  )}
                                  <span className="truncate">{p_post.content}</span>
                                </div>
                              );
                            })}
                            {dayPlatformPosts.length > 3 && (
                              <div className="text-xs text-gray-400 mt-1">
                                +{dayPlatformPosts.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Posts for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getPlatformPostsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No posts scheduled for this date</p>
                    <Button 
                      onClick={() => setShowCreateModal(true)}
                      className="social-gradient"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getPlatformPostsForDate(selectedDate).map(p_post => {
                      const style = getPlatformStyle(p_post.platform);
                      const Icon = style.icon;
                      return (
                        <div
                          key={`${p_post.id}-${p_post.platform}`}
                          className={`p-4 rounded-lg bg-white/5 border-l-4 ${style.borderColor}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={`${style.bgColor} ${style.textColor} capitalize`}>
                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                {p_post.platform}
                              </Badge>
                              <Badge variant="secondary" className={`text-xs ${getStatusColor(p_post.status)}`}>
                                {p_post.status}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                              {new Date(p_post.scheduledDate).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Badge>
                          </div>
                          <p className="text-white">{p_post.content}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreatePost}
        />
      </div>
    </>
  );
};

export default Calendar;