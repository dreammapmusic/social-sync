import { getApiUrl } from '../config.js';

// OAuth Configuration for different platforms
const OAUTH_CONFIG = {
  facebook: {
    clientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/facebook`,
    scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth'
  },
  instagram: {
    // Instagram uses Facebook OAuth
    clientId: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/instagram`,
    scope: 'instagram_basic,instagram_content_publish',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth'
  },
  twitter: {
    clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/twitter`,
    scope: 'tweet.read,tweet.write,users.read,offline.access',
    authUrl: 'https://twitter.com/i/oauth2/authorize'
  },
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/linkedin`,
    scope: 'r_liteprofile,r_emailaddress,w_member_social',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization'
  },
  youtube: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/oauth/callback/youtube`,
    scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  }
};

class OAuthService {
  constructor() {
    this.apiUrl = getApiUrl();
    this.pendingConnections = new Map();
    
    // Listen for OAuth callback messages
    window.addEventListener('message', this.handleOAuthCallback.bind(this));
  }

  /**
   * Initiate OAuth flow for a platform
   */
  async initiateOAuth(platform) {
    const config = OAUTH_CONFIG[platform];
    if (!config || !config.clientId) {
      throw new Error(`OAuth not configured for ${platform}. Please add the required environment variables.`);
    }

    // Generate state parameter for security
    const state = this.generateState();
    this.pendingConnections.set(state, { platform, timestamp: Date.now() });

    // Build OAuth URL
    const authUrl = this.buildAuthUrl(platform, config, state);

    // Open OAuth popup
    const popup = this.openOAuthPopup(authUrl, platform);
    
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          this.pendingConnections.delete(state);
          reject(new Error('OAuth authorization was cancelled'));
        }
      }, 1000);

      // Store resolve/reject for callback handling
      this.pendingConnections.set(state, {
        platform,
        timestamp: Date.now(),
        resolve,
        reject,
        popup,
        checkClosed
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        if (this.pendingConnections.has(state)) {
          clearInterval(checkClosed);
          popup.close();
          this.pendingConnections.delete(state);
          reject(new Error('OAuth authorization timed out'));
        }
      }, 300000);
    });
  }

  /**
   * Build OAuth authorization URL
   */
  buildAuthUrl(platform, config, state) {
    // Build parameters manually to avoid double-encoding redirect_uri
    const params = [
      `client_id=${encodeURIComponent(config.clientId)}`,
      `redirect_uri=${config.redirectUri}`, // Don't encode - Facebook will handle it
      `scope=${encodeURIComponent(config.scope)}`,
      `response_type=code`,
      `state=${encodeURIComponent(state)}`
    ];

    // Platform-specific parameters
    if (platform === 'twitter') {
      params.push('code_challenge=challenge');
      params.push('code_challenge_method=plain');
    }

    return `${config.authUrl}?${params.join('&')}`;
  }

  /**
   * Open OAuth popup window
   */
  openOAuthPopup(url, platform) {
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    return window.open(
      url,
      `oauth_${platform}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  /**
   * Handle OAuth callback from popup
   */
  handleOAuthCallback(event) {
    if (event.origin !== window.location.origin) return;

    const { type, data } = event.data;
    if (type !== 'OAUTH_CALLBACK') return;

    const { state, code, error } = data;
    const connection = this.pendingConnections.get(state);

    if (!connection) {
      console.error('No pending connection found for state:', state);
      return;
    }

    const { platform, resolve, reject, popup, checkClosed } = connection;

    // Clean up
    clearInterval(checkClosed);
    popup.close();
    this.pendingConnections.delete(state);

    if (error) {
      reject(new Error(error));
      return;
    }

    if (code) {
      // Exchange code for tokens via backend
      this.exchangeCodeForTokens(platform, code, state)
        .then(resolve)
        .catch(reject);
    } else {
      reject(new Error('No authorization code received'));
    }
  }

  /**
   * Exchange authorization code for access tokens
   */
  async exchangeCodeForTokens(platform, code, state) {
    try {
      const response = await fetch(`${this.apiUrl}/api/oauth/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          platform,
          code,
          state,
          redirectUri: OAUTH_CONFIG[platform].redirectUri
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to exchange authorization code');
      }

      const result = await response.json();
      return result.account;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  /**
   * Generate secure state parameter
   */
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Check if platform OAuth is configured
   */
  isPlatformConfigured(platform) {
    const config = OAUTH_CONFIG[platform];
    return config && config.clientId;
  }

  /**
   * Get configuration status for all platforms
   */
  getConfigurationStatus() {
    const status = {};
    Object.keys(OAUTH_CONFIG).forEach(platform => {
      status[platform] = this.isPlatformConfigured(platform);
    });
    return status;
  }

  /**
   * Disconnect account
   */
  async disconnectAccount(accountId) {
    try {
      const response = await fetch(`${this.apiUrl}/api/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to disconnect account');
      }

      return await response.json();
    } catch (error) {
      console.error('Disconnect account error:', error);
      throw error;
    }
  }

  /**
   * Get connected accounts
   */
  async getConnectedAccounts() {
    try {
      const response = await fetch(`${this.apiUrl}/api/accounts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get connected accounts');
      }

      const result = await response.json();
      return result.accounts || [];
    } catch (error) {
      console.error('Get connected accounts error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const oauthService = new OAuthService();
export default oauthService; 