import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const NotificationSettings = ({ settings, onChange }) => {
  if (!settings) {
    return (
        <Card className="glass-effect border-white/10">
            <CardHeader>
                <CardTitle className="text-white">Notifications</CardTitle>
                <CardDescription className="text-gray-400">Loading settings...</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-white/5 rounded-lg"></div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <CardTitle className="text-white">Notifications</CardTitle>
            <CardDescription className="text-gray-400">
              Configure your notification preferences
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div>
              <p className="font-medium text-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-sm text-gray-400">
                {key === 'email' && 'Receive notifications via email'}
                {key === 'push' && 'Receive push notifications'}
                {key === 'postReminders' && 'Get reminders before posts go live'}
                {key === 'weeklyReports' && 'Receive weekly analytics reports'}
              </p>
            </div>
            <Button
              variant={value ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(key, !value)}
              className={value ? "social-gradient" : "border-white/10 text-gray-300"}
            >
              {value ? 'On' : 'Off'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;