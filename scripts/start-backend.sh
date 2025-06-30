#!/bin/bash

echo "🚀 Starting SocialSync Backend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if api directory exists
if [ ! -d "api" ]; then
    echo "❌ API directory not found. Please ensure the backend is set up."
    exit 1
fi

# Navigate to API directory
cd api

# Check if wrangler.toml exists
if [ ! -f "wrangler.toml" ]; then
    echo "❌ wrangler.toml not found. Please set up your Cloudflare Workers configuration."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start the development server
echo "🔄 Starting Cloudflare Workers development server..."
echo "Backend will be available at: http://localhost:8787"
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev 