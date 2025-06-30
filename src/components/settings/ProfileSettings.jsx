import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Camera, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const ProfileSettings = ({ user, setUser }) => {
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target.result;
        setAvatar(newAvatar);
        setUser({ ...user, avatar: newAvatar });
        toast({ title: "Avatar updated", description: "Your profile picture has been updated successfully" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
    setUser({ ...user, avatar: null });
    toast({ title: "Avatar removed", description: "Your profile picture has been removed" });
  };

  const validatePasswords = () => {
    const newErrors = {};
    if (formData.newPassword || formData.currentPassword) {
        if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (formData.newPassword && formData.newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters';
        if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validatePasswords()) {
      toast({
          title: "Update Failed",
          description: "Please check the errors before saving.",
          variant: "destructive"
      });
      return;
    }
    
    setUser({ ...user, name: formData.name });

    toast({
      title: "Profile Updated",
      description: "Your settings have been saved successfully.",
    });

    if(formData.newPassword) {
        setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
    }
  };
  
  const handleAccountDeletion = () => {
    if(deleteConfirmation !== 'DELETE') {
        toast({
            title: "Deletion Failed",
            description: "Please type 'DELETE' to confirm.",
            variant: "destructive"
        });
        return;
    }
    toast({
      title: "Account Scheduled for Deletion",
      description: "Your account and all associated data will be permanently removed in 30 days.",
      variant: "destructive"
    });
  };

  return (
    <Card className="glass-effect border-white/10 overflow-hidden">
      <CardHeader className="bg-white/5 p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} />
              <AvatarFallback>
                <User className="h-12 w-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Label htmlFor="avatar-upload" className="cursor-pointer text-white p-2">
                <Camera className="h-5 w-5" />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </Label>
              {avatar && (
                <button onClick={handleDeleteAvatar} className="text-white p-2">
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">{formData.name || 'Your Name'}</h1>
            <p className="text-gray-400">{formData.email}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
                <Label className="text-gray-300">Full Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} className="bg-white/5 border-white/10 text-white" placeholder="Your full name" />
          </div>
          <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <Input name="email" value={formData.email} className="bg-white/5 border-white/10 text-white" placeholder="your@email.com" readOnly />
              </div>
            </div>

            <div className="border-t border-white/10"></div>

            <div className="space-y-4">
               <div className="mb-4">
                 <h3 className="font-semibold text-white text-lg">Change Password</h3>
                 <p className="text-sm text-gray-400">For security, please enter your current password to make changes.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Current Password</Label>
                    <div className="relative">
                      <Input name="currentPassword" type={showCurrentPassword ? "text" : "password"} value={formData.currentPassword} onChange={handleInputChange} className="bg-white/5 border-white/10 text-white pr-10" placeholder="Enter current password" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.currentPassword && <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>}
                  </div>
                  
                  <div></div> {/* Spacer for grid layout */}

                  <div className="space-y-2">
                    <Label className="text-gray-300">New Password</Label>
                    <div className="relative">
                      <Input name="newPassword" type={showNewPassword ? "text" : "password"} value={formData.newPassword} onChange={handleInputChange} className="bg-white/5 border-white/10 text-white pr-10" placeholder="Enter new password" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Confirm New Password</Label>
                    <div className="relative">
                      <Input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} className="bg-white/5 border-white/10 text-white pr-10" placeholder="Confirm new password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
               </div>
              
              {(formData.newPassword || formData.confirmPassword || formData.currentPassword) && (
                <div className="md:col-span-2 mt-4">
                  <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Password must be at least 8 characters long.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-white/5 p-6 flex justify-between items-center border-t border-white/10">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="bg-red-500/10 text-red-400 hover:bg-red-500/20">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Account</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete your account? This action is permanent.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All your data will be permanently deleted. This cannot be undone.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label className="text-gray-300">To confirm, type "DELETE" below:</Label>
                <Input
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="DELETE"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                />
        </div>
        <Button 
                variant="destructive"
                className="w-full"
                onClick={handleAccountDeletion}
                disabled={deleteConfirmation !== 'DELETE'}
              >
                Permanently Delete Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button className="social-gradient" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;