import React, { useState, useEffect } from 'react';
import ProfileSettings from '../components/settings/ProfileSettings';
import ConnectedAccounts from '../components/settings/ConnectedAccounts';
import NotificationSettings from '../components/settings/NotificationSettings';
import PrivacySettings from '../components/settings/PrivacySettings';
import UserManagement from '../components/settings/UserManagement';
import { useToast } from '../components/ui/use-toast';

const Settings = ({ user, setUser }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [teamUsers, setTeamUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('editor');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Load settings data
    const loadSettingsData = () => {
      let savedSettings = JSON.parse(localStorage.getItem('socialScheduler_settings') || 'null');
      if (!savedSettings) {
        savedSettings = {
          notifications: { email: true, push: true, postReminders: true, weeklyReports: false },
          privacy: { profileVisible: true, analyticsSharing: false }
        };
        localStorage.setItem('socialScheduler_settings', JSON.stringify(savedSettings));
      }
      setSettings(savedSettings);

      let usersData = JSON.parse(localStorage.getItem('socialScheduler_team_users') || 'null');
      if (!usersData) {
        usersData = [
          { id: 1, email: 'alex.johnson@company.com', name: 'Alex Johnson', role: 'admin', joinedAt: '2024-09-15T10:30:00Z', lastActive: '2025-01-15T14:30:00Z', avatar: null },
          { id: 2, email: 'sarah.marketing@company.com', name: 'Sarah Martinez', role: 'editor', joinedAt: '2024-10-20T09:15:00Z', lastActive: '2025-01-15T12:45:00Z', avatar: null },
        ];
        localStorage.setItem('socialScheduler_team_users', JSON.stringify(usersData));
      }
      setTeamUsers(usersData);
      
      setIsLoading(false);
    };

    loadSettingsData();
  }, []);

  useEffect(() => {
    // Handle user role logic
    if (user && teamUsers.length > 0) {
      const currentUserInTeam = teamUsers.find(u => u.email === user.email);
      if (currentUserInTeam) {
        setCurrentUserRole(currentUserInTeam.role);
      }
    }
  }, [user, teamUsers]);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('socialScheduler_settings', JSON.stringify(newSettings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleNotificationChange = (key, value) => {
    const newSettings = { ...settings, notifications: { ...settings.notifications, [key]: value } };
    saveSettings(newSettings);
  };

  const handlePrivacyChange = (key, value) => {
    const newSettings = { ...settings, privacy: { ...settings.privacy, [key]: value } };
    saveSettings(newSettings);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Loading your preferences...</p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-white/5 rounded-lg"></div>
          <div className="h-32 bg-white/5 rounded-lg"></div>
          <div className="h-32 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        <ProfileSettings user={user} setUser={setUser} />
        <ConnectedAccounts />
        <NotificationSettings settings={settings.notifications} onChange={handleNotificationChange} />
        <PrivacySettings settings={settings.privacy} onChange={handlePrivacyChange} />

              {currentUserRole === 'admin' && (
        <UserManagement users={teamUsers} setUsers={setTeamUsers} />
      )}
    </div>
  );
};

export default Settings;