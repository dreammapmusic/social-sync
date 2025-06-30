# Environment Setup Guide

## Frontend Environment Variables

The application is configured to use the same production backend for both local development and live deployment. This ensures consistency and eliminates environment-specific issues.

### For All Environments (Recommended)
```bash
# No .env file needed - uses production backend automatically
# The app will use: https://social-sync-api.norbert-gobor3.workers.dev
```

### For Custom API URL (Optional)
```bash
# Only if you want to override the default
VITE_API_URL=https://your-custom-api-url.com
```

## Backend Configuration

The production backend is already deployed and configured at:
- **URL**: `https://social-sync-api.norbert-gobor3.workers.dev`
- **Database**: D1 database with all tables created
- **CORS**: Configured for multiple origins including localhost

## Setup Steps

### 1. Frontend Setup (No Backend Required)
1. Clone the repository: `git clone https://github.com/dreammapmusic/social-sync.git`
2. Install dependencies: `npm install`
3. Start frontend: `npm run dev`
4. App will automatically connect to the production backend

### 2. Local Development
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
# Backend: https://social-sync-api.norbert-gobor3.workers.dev
```

### 3. Production Deployment
1. Deploy frontend to Netlify/Vercel/GitHub Pages
2. No backend deployment needed - already live
3. Frontend will automatically use the production backend

## Demo Account

The production backend includes a demo account for testing:
- Email: `demo@socialsync.com`
- Password: `demo123`

This account is available in both local development and live deployment.

## Benefits of This Approach

✅ **Consistency**: Same backend for all environments  
✅ **Simplicity**: No local backend setup required  
✅ **Reliability**: Production-tested backend  
✅ **Real Data**: All users share the same database  
✅ **Easy Testing**: Local changes test against real backend  

## Troubleshooting

If you encounter CORS issues:
1. The backend supports multiple origins including localhost
2. Check browser console for specific error messages
3. Ensure you're using the latest deployed backend version 