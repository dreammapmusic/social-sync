#!/bin/bash

# SocialSync Deployment Script

echo "🚀 SocialSync Deployment Starting..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not available. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Parse arguments
DEPLOY_BACKEND=false
DEPLOY_FRONTEND=false
ENVIRONMENT="production"

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend)
            DEPLOY_BACKEND=true
            shift
            ;;
        --frontend)
            DEPLOY_FRONTEND=true
            shift
            ;;
        --all)
            DEPLOY_BACKEND=true
            DEPLOY_FRONTEND=true
            shift
            ;;
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option $1"
            echo "Usage: ./deploy.sh [--backend] [--frontend] [--all] [--env production|staging]"
            exit 1
            ;;
    esac
done

# If no specific deployment specified, deploy both
if [ "$DEPLOY_BACKEND" = false ] && [ "$DEPLOY_FRONTEND" = false ]; then
    DEPLOY_BACKEND=true
    DEPLOY_FRONTEND=true
fi

echo "🎯 Deployment targets: Backend=$DEPLOY_BACKEND, Frontend=$DEPLOY_FRONTEND"
echo "🌍 Environment: $ENVIRONMENT"

# Deploy Backend
if [ "$DEPLOY_BACKEND" = true ]; then
    echo ""
    echo "🔧 Deploying Backend (Cloudflare Workers)..."
    
    if ! command_exists wrangler; then
        echo "📦 Installing Wrangler CLI..."
        npm install -g wrangler
    fi
    
    cd api
    
    # Install dependencies
    echo "📦 Installing backend dependencies..."
    npm install
    
    # Deploy to Cloudflare Workers
    echo "🚀 Deploying to Cloudflare Workers..."
    if [ "$ENVIRONMENT" = "staging" ]; then
        wrangler deploy --env staging
    else
        wrangler deploy
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend deployment successful!"
    else
        echo "❌ Backend deployment failed!"
        exit 1
    fi
    
    cd ..
fi

# Deploy Frontend
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo ""
    echo "🎨 Deploying Frontend..."
    
    # Install dependencies
    echo "📦 Installing frontend dependencies..."
    npm install
    
    # Build the frontend
    echo "🔨 Building frontend..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend build successful!"
        
        # Check for deployment platforms
        if command_exists netlify; then
            echo "🌐 Deploying to Netlify..."
            netlify deploy --prod --dir=dist
        elif command_exists vercel; then
            echo "🌐 Deploying to Vercel..."
            vercel --prod
        else
            echo "📁 Frontend built successfully! Deploy the 'dist' folder to your hosting platform."
            echo "   - For Netlify: netlify deploy --prod --dir=dist"
            echo "   - For Vercel: vercel --prod"
            echo "   - For manual hosting: Upload the 'dist' folder contents"
        fi
    else
        echo "❌ Frontend build failed!"
        exit 1
    fi
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Update your frontend environment variables with the deployed API URL"
echo "   2. Test your deployment thoroughly"
echo "   3. Monitor logs for any issues"
echo ""
echo "🔗 Useful commands:"
echo "   - View Worker logs: wrangler tail"
echo "   - View database: wrangler d1 studio social-sync-db"
echo "   - Update environment: Update .env with production URLs" 