# SocialSync - Social Media Management Platform

A modern social media scheduling and management platform built with React (frontend) and Cloudflare Workers + D1 Database (backend).

## 🚀 Features

- **Multi-Platform Posting**: Schedule posts across Facebook, Instagram, Twitter, LinkedIn, and YouTube
- **Calendar View**: Visual calendar interface for managing scheduled posts
- **Analytics Dashboard**: Comprehensive analytics and insights
- **File Management**: Upload and manage media files
- **Team Collaboration**: User management and role-based access
- **Real-time Updates**: Fast, responsive interface
- **Dark Mode**: Modern dark theme optimized for productivity

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **Radix UI** components for accessibility

### Backend
- **Cloudflare Workers** for edge computing
- **D1 Database** (SQLite) for data storage
- **JWT Authentication** for secure access
- **RESTful API** design

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Cloudflare account (for backend deployment)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd social-sync
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Backend Setup

#### Install Wrangler CLI
```bash
npm install -g wrangler
```

#### Authenticate with Cloudflare
```bash
wrangler login
```

#### Set up D1 Database
```bash
# Navigate to API directory
cd api

# Install dependencies
npm install

# Create D1 database
npm run db:create

# Note: Copy the database ID from the output and update wrangler.toml
```

#### Update wrangler.toml
Replace `your-database-id-here` in `wrangler.toml` with your actual D1 database ID.

#### Run Database Migrations
```bash
# Apply migrations locally
npm run db:migrate

# Or apply to remote database
npm run db:migrate:remote
```

#### Start Development Server
```bash
# Start local development server
npm run dev
```

The API will be available at `http://localhost:8787`

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Frontend Environment Variables
VITE_API_URL=http://localhost:8787

# For production, use your deployed Worker URL:
# VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

#### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (install netlify-cli first)
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Backend Deployment (Cloudflare Workers)

```bash
cd api

# Deploy to Cloudflare Workers
npm run deploy
```

After deployment, update your frontend environment variable:
```bash
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

## 🗄️ Database Schema

The D1 database includes the following tables:

- `users` - User accounts and authentication
- `posts` - Social media posts and drafts
- `connected_accounts` - Social media platform connections
- `analytics` - Performance metrics and insights
- `user_settings` - User preferences and configuration
- `files` - Uploaded media files
- `team_users` - Team collaboration and user management

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/calendar/:year/:month` - Get calendar posts

### Analytics
- `GET /api/analytics` - Get analytics overview
- `GET /api/analytics/platforms` - Get platform-specific analytics
- `POST /api/analytics` - Add analytics data

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/profile` - Update profile
- `GET /api/settings/team` - Get team users
- `POST /api/settings/team` - Add team user
- `DELETE /api/settings/team/:userId` - Remove team user

### Connected Accounts
- `GET /api/accounts` - Get connected accounts
- `POST /api/accounts` - Connect new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Disconnect account

### Files
- `GET /api/files` - Get all files
- `POST /api/files` - Upload file
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file

## 🔧 Development

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
cd api

# Start local development
npm run dev

# View database in studio
npm run db:studio

# Create new migration
wrangler d1 migrations create social-sync-db migration-name
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- User-based data isolation
- Role-based access control

## 🌐 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8787
```

### Backend (Cloudflare Workers)
Configure in `wrangler.toml` under `[vars]`:
```toml
CORS_ORIGIN = "https://your-frontend-domain.com"
JWT_SECRET = "your-jwt-secret-here"
```

## 📊 Performance

- **Edge Computing**: Cloudflare Workers provide global low-latency API responses
- **Efficient Database**: D1 SQLite database optimized for read-heavy workloads
- **Modern Frontend**: Vite + React for fast development and optimized builds
- **CDN Integration**: Static assets served via Cloudflare's global CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the deployment logs in Cloudflare Dashboard
3. Verify environment variables are set correctly
4. Ensure database migrations have been applied

## 🚀 Getting Started Quickly

For a quick start with mock data:

1. **Frontend Only**: Run `npm run dev` - the app will work with localStorage mock data
2. **Full Stack**: Follow the complete setup above for the real backend experience

The application requires the Cloudflare Workers backend to function properly. All data is managed through the API. 