# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the root directory with the following variables:

### For Local Development
```bash
VITE_API_URL=http://localhost:8787
```

### For Production
```bash
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

## Backend Configuration

Update `wrangler.toml` with your actual database ID and environment variables:

```toml
[vars]
CORS_ORIGIN = "https://your-frontend-domain.com"
JWT_SECRET = "your-secure-jwt-secret-here"
```

## Setup Steps

### 1. Backend Setup (Required)
1. Set up Cloudflare Workers backend (see README.md)
2. Create D1 database and run migrations
3. Update `wrangler.toml` with your database ID
4. Run backend locally: `cd api && npm run dev`

### 2. Frontend Setup
1. Create `.env` file with `VITE_API_URL=http://localhost:8787`
2. Install dependencies: `npm install`
3. Run frontend: `npm run dev`
4. App will connect to your backend API

### 3. Production Deployment
1. Deploy backend to Cloudflare Workers: `cd api && npm run deploy`
2. Deploy frontend to Netlify/Vercel
3. Update frontend `.env` with production backend URL

## Demo Account

The app includes a demo account for testing:
- Email: `demo@socialsync.com`
- Password: `demo123`

This account is created automatically when the backend starts. 