import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Plus, Check, X, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'facebook-gradient' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'instagram-gradient' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'twitter-gradient' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'linkedin-gradient' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'youtube-gradient' }
];

const ConnectedAccounts = ({ connectedAccounts, setConnectedAccounts }) => {
  if (!connectedAccounts) {
    return (
        <Card className="glass-effect border-white/10">
            <CardHeader>
                <CardTitle className="text-white">Connected Accounts</CardTitle>
                <CardDescription className="text-gray-400">Loading connections...</CardDescription>
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

  const isAccountConnected = (platformId) => {
    return connectedAccounts.some(account => account.platform === platformId);
  };

  const connectAccount = (platform) => {
    const newAccount = {
      id: Date.now(),
      platform,
      username: `@user_${platform}`,
      connected: true,
      connectedAt: new Date().toISOString()
    };
    
    const updatedAccounts = [...connectedAccounts, newAccount];
    setConnectedAccounts(updatedAccounts);
    localStorage.setItem('socialScheduler_accounts', JSON.stringify(updatedAccounts));
    
    toast({
      title: "Account connected",
      description: `Your ${platform} account has been connected successfully.`,
    });
  };

  const disconnectAccount = (accountId) => {
    const updatedAccounts = connectedAccounts.filter(account => account.id !== accountId);
    setConnectedAccounts(updatedAccounts);
    localStorage.setItem('socialScheduler_accounts', JSON.stringify(updatedAccounts));
    
    toast({
      title: "Account disconnected",
      description: "The account has been removed from your connected accounts.",
    });
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <CardTitle className="text-white">Connected Accounts</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your social media connections
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platforms.map(platform => {
            const Icon = platform.icon;
            const connected = isAccountConnected(platform.id);
            const account = connectedAccounts.find(acc => acc.platform === platform.id);
            
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded ${platform.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{platform.name}</p>
                    {connected ? (
                      <p className="text-sm text-gray-400">{account?.username}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Not connected</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {connected ? (
                    <>
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => disconnectAccount(account.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => connectAccount(platform.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedAccounts;