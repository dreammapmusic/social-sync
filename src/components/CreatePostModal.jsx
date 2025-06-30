import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube, Image, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const CreatePostModal = ({ isOpen, onClose, onSave, postToEdit }) => {
  const [formData, setFormData] = useState({
    content: '',
    platforms: [],
    scheduledDate: '',
    scheduledTime: '',
    image: null
  });

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'facebook-gradient' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'instagram-gradient' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'twitter-gradient' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'linkedin-gradient' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'youtube-gradient' }
  ];

  const resetForm = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setFormData({
      content: '',
      platforms: [],
      scheduledDate: currentDate,
      scheduledTime: currentTime,
      image: null
    });
  };

  useEffect(() => {
    if (postToEdit && isOpen) {
      const scheduledDateTime = postToEdit.scheduledDate ? new Date(postToEdit.scheduledDate) : null;
      setFormData({
        content: postToEdit.content || '',
        platforms: postToEdit.platforms || [],
        scheduledDate: scheduledDateTime ? scheduledDateTime.toISOString().split('T')[0] : '',
        scheduledTime: scheduledDateTime ? scheduledDateTime.toTimeString().slice(0, 5) : '',
        image: postToEdit.image || null,
      });
    } else if (isOpen) {
      // Auto-populate with current date and time for new posts
      resetForm();
    }
  }, [postToEdit, isOpen]);

  const handlePlatformToggle = (platformId) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast({ title: "Content required", description: "Please enter some content for your post.", variant: "destructive" });
      return;
    }
    
    if (formData.platforms.length === 0) {
      toast({ title: "Platform required", description: "Please select at least one platform.", variant: "destructive" });
      return;
    }
    
    if (!formData.scheduledDate || !formData.scheduledTime) {
      toast({ title: "Schedule required", description: "Please select a date and time for your post.", variant: "destructive" });
      return;
    }
    
    onSave({ ...postToEdit, ...formData }, 'scheduled');
  };
  
  const handleSaveDraft = () => {
     if (!formData.content.trim()) {
      toast({ title: "Content required", description: "Please enter some content for your draft.", variant: "destructive" });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({ title: "Platform required", description: "Please select at least one platform for your draft.", variant: "destructive" });
      return;
    }

    onSave({ ...postToEdit, ...formData }, 'draft');
  };


  const handleImageUpload = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="glass-effect border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white">{postToEdit ? 'Edit Post' : 'Create New Post'}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleScheduleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Content</label>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[120px]"
                    maxLength={280}
                  />
                  <div className="text-right text-sm text-gray-400">
                    {formData.content.length}/280
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Platforms</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = formData.platforms.includes(platform.id);
                      
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => handlePlatformToggle(platform.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-blue-500/50 bg-blue-500/10'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className={`h-8 w-8 rounded ${platform.color} flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-white">{platform.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Date</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Time</label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Media (Optional)</label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                    onClick={handleImageUpload}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Add Image or Video
                  </Button>
                </div>

                <div className="space-y-3 pt-4">
                  {/* Mobile: Stack all buttons vertically */}
                  <div className="flex flex-col gap-3 sm:hidden">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                      className="w-full border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                      className="w-full border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    <Button
                      type="submit"
                      className="w-full social-gradient"
                    >
                      Schedule Post
                    </Button>
                  </div>

                  {/* Desktop: Two rows with proper spacing */}
                  <div className="hidden sm:flex flex-col gap-3">
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                        className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                     <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                        className="flex-1 social-gradient"
                  >
                    Schedule Post
                  </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="w-full border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreatePostModal;