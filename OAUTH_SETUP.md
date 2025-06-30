# OAuth Setup Guide for SocialSync

This guide will help you set up OAuth authentication for each social media platform so users can connect their real accounts.

## Prerequisites

1. Copy `env.example` to `.env` in your project root
2. You'll need to create developer apps on each platform you want to support

## Platform Setup Instructions

### 1. Facebook (and Instagram)

Instagram uses Facebook's OAuth system, so setting up Facebook covers both platforms.

1. **Go to Facebook Developers**: https://developers.facebook.com/apps/
2. **Create a New App**:
   - Choose "Consumer" app type
   - Fill in app details
3. **Add Facebook Login Product**:
   - Go to "Add a Product" → "Facebook Login"
   - Choose "Web" platform
4. **Configure OAuth Settings**:
   - Valid OAuth Redirect URIs:
     ```
     http://localhost:5173/oauth/callback/facebook
     https://yourdomain.com/oauth/callback/facebook
     http://localhost:5173/oauth/callback/instagram
     https://yourdomain.com/oauth/callback/instagram
     ```
5. **Get Credentials**:
   - Copy App ID → `VITE_FACEBOOK_CLIENT_ID`
   - App Secret will be needed for backend (Cloudflare Workers secrets)

### 2. Twitter/X

1. **Go to Twitter Developer Portal**: https://developer.twitter.com/en/portal/dashboard
2. **Create a New Project & App**:
   - Apply for developer access if you don't have it
   - Create a new project and app
3. **Configure OAuth 2.0**:
   - Go to App Settings → User authentication settings
   - Enable OAuth 2.0
   - Set Callback URLs:
     ```
     http://localhost:5173/oauth/callback/twitter
     https://yourdomain.com/oauth/callback/twitter
     ```
   - Set Website URL to your domain
4. **Get Credentials**:
   - Copy Client ID → `VITE_TWITTER_CLIENT_ID`
   - Client Secret will be needed for backend

### 3. LinkedIn

1. **Go to LinkedIn Developers**: https://www.linkedin.com/developers/apps
2. **Create a New App**:
   - Fill in company information
   - Upload company logo
3. **Add Products**:
   - Request "Sign In with LinkedIn" product
   - Request "Marketing Developer Platform" if available
4. **Configure OAuth**:
   - Go to Auth tab
   - Add Authorized Redirect URLs:
     ```
     http://localhost:5173/oauth/callback/linkedin
     https://yourdomain.com/oauth/callback/linkedin
     ```
5. **Get Credentials**:
   - Copy Client ID → `VITE_LINKEDIN_CLIENT_ID`
   - Client Secret will be needed for backend

### 4. YouTube (Google)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials
2. **Create a Project** (if you don't have one)
3. **Enable YouTube Data API v3**:
   - Go to APIs & Services → Library
   - Search for "YouTube Data API v3" and enable it
4. **Create OAuth Credentials**:
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     ```
     http://localhost:5173
     https://yourdomain.com
     ```
   - Add Authorized redirect URIs:
     ```
     http://localhost:5173/oauth/callback/youtube
     https://yourdomain.com/oauth/callback/youtube
     ```
5. **Get Credentials**:
   - Copy Client ID → `VITE_GOOGLE_CLIENT_ID`
   - Client Secret will be needed for backend

## Backend Configuration (Cloudflare Workers)

You'll also need to add the client secrets to your Cloudflare Workers environment:

```bash
# Navigate to your api directory
cd api

# Add secrets for each platform you're using
wrangler secret put FACEBOOK_CLIENT_SECRET
wrangler secret put TWITTER_CLIENT_SECRET  
wrangler secret put LINKEDIN_CLIENT_SECRET
wrangler secret put GOOGLE_CLIENT_SECRET

# Deploy your updated worker
npm run deploy
```

## Environment Variables Summary

Create a `.env` file in your project root with:

```env
# Facebook OAuth (also used for Instagram)
VITE_FACEBOOK_CLIENT_ID=your_facebook_app_id_here

# Twitter OAuth
VITE_TWITTER_CLIENT_ID=your_twitter_client_id_here

# LinkedIn OAuth
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here

# Google OAuth (used for YouTube)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Testing OAuth Flows

1. **Start your development server**: `npm run dev`
2. **Go to Settings** → Connected Accounts
3. **Click Connect** on any configured platform
4. **Complete the OAuth flow** in the popup window
5. **Verify the account appears** as connected

## Troubleshooting

### Common Issues:

1. **"OAuth not configured" error**:
   - Make sure you've added the correct environment variables
   - Restart your dev server after adding environment variables

2. **"Invalid redirect URI" error**:
   - Check that your redirect URIs in the platform settings match exactly
   - Include both localhost (for development) and your production domain

3. **"App not approved" error**:
   - Some platforms require app review for production use
   - You can usually test with your own accounts without approval

4. **CORS errors**:
   - Make sure your domain is added to the platform's allowed origins
   - Check that you're using the correct callback URLs

### Platform-Specific Notes:

- **Facebook/Instagram**: Requires app review for public use
- **Twitter**: Has rate limits on OAuth requests
- **LinkedIn**: May require company verification for some features
- **YouTube**: Requires Google app verification for public use

## Production Deployment

When deploying to production:

1. Update all OAuth redirect URIs to use your production domain
2. Add production environment variables to your hosting platform
3. Complete any required app reviews for the platforms
4. Test the OAuth flows on your production site

## Security Notes

- Never commit your `.env` file to version control
- Store client secrets securely in your backend environment
- Use HTTPS in production for all OAuth flows
- Regularly rotate your OAuth credentials
- Monitor OAuth usage for any suspicious activity 