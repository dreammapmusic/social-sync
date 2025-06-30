import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Smartphone, Plus, Check, X, Facebook, Instagram, Twitter, Linkedin, Youtube, AlertCircle, Settings } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import oauthService from '../../lib/oauthService';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'facebook-gradient' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'instagram-gradient' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'twitter-gradient' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'linkedin-gradient' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'youtube-gradient' }
];

const ConnectedAccounts = () => {
  const { toast } = useToast();
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState({});
  const [configStatus, setConfigStatus] = useState({});

  useEffect(() => {
    loadConnectedAccounts();
    checkOAuthConfiguration();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await oauthService.getConnectedAccounts();
      setConnectedAccounts(accounts);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
      toast({
        title: "Error loading accounts",
        description: "Failed to load connected accounts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkOAuthConfiguration = () => {
    const status = oauthService.getConfigurationStatus();
    setConfigStatus(status);
  };

  const isAccountConnected = (platformId) => {
    return connectedAccounts.some(account => account.platform === platformId);
  };

  const connectAccount = async (platform) => {
    if (!configStatus[platform]) {
      toast({
        title: "Configuration Required",
        description: `${platform} OAuth is not configured. Please add the required environment variables.`,
        variant: "destructive"
      });
      return;
    }

    if (connecting[platform]) return;

    try {
      setConnecting(prev => ({ ...prev, [platform]: true }));
      
      toast({
        title: `Connecting to ${platform}...`,
        description: "Opening authorization window. Please complete the authorization process.",
      });

      const account = await oauthService.initiateOAuth(platform);
      
      // Reload accounts after successful connection
      await loadConnectedAccounts();
      
      toast({
        title: "Account connected successfully!",
        description: `Your ${platform} account has been connected and is ready for posting.`,
      });
      
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
      toast({
        title: "Connection failed",
        description: error.message || `Failed to connect ${platform} account. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setConnecting(prev => ({ ...prev, [platform]: false }));
    }
  };

  const disconnectAccount = async (account) => {
    try {
      await oauthService.disconnectAccount(account.id);
      
      // Remove from local state
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== account.id));
      
      toast({
        title: "Account disconnected",
        description: `Your ${account.platform} account has been disconnected.`,
      });
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      toast({
        title: "Disconnection failed",
        description: error.message || "Failed to disconnect account. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
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
              Connect your social media accounts to start scheduling posts
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
            const isConnecting = connecting[platform.id];
            const isConfigured = configStatus[platform.id];
            
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{platform.name}</p>
                      {!isConfigured && (
                        <AlertCircle className="h-4 w-4 text-amber-400" title="OAuth not configured" />
                      )}
                    </div>
                    {connected ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400">{account?.username || account?.platform_user_id}</p>
                        {account?.verified && (
                          <Check className="h-3 w-3 text-blue-400" title="Verified account" />
                        )}
                        {account?.followers_count && (
                          <span className="text-xs text-gray-500">
                            {account.followers_count.toLocaleString()} followers
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {isConfigured ? 'Not connected' : 'OAuth not configured'}
                      </p>
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
                        onClick={() => disconnectAccount(account)}
                        disabled={isConnecting}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className={`border-white/10 text-gray-300 hover:bg-white/5 hover:text-white ${
                        !isConfigured ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => connectAccount(platform.id)}
                      disabled={isConnecting || !isConfigured}
                    >
                      {isConnecting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Connect
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Configuration Notice */}
        {Object.values(configStatus).some(status => !status) && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Settings className="h-4 w-4" />
              <p className="font-medium">OAuth Configuration Required</p>
            </div>
            <p className="text-sm text-amber-300">
              Some platforms require OAuth configuration. Add the following environment variables to your .env file:
            </p>
            <ul className="text-xs text-amber-200 mt-2 space-y-1">
              {!configStatus.facebook && <li>• VITE_FACEBOOK_CLIENT_ID</li>}
              {!configStatus.twitter && <li>• VITE_TWITTER_CLIENT_ID</li>}
              {!configStatus.linkedin && <li>• VITE_LINKEDIN_CLIENT_ID</li>}
              {!configStatus.youtube && <li>• VITE_GOOGLE_CLIENT_ID</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectedAccounts;