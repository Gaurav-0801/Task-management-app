#!/bin/bash

# Task Management App Setup Script
# This script automates the initial setup process

set -e

echo "🚀 Task Management App Setup"
echo "================================"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env.local file
if [ ! -f .env.local ]; then
    echo ""
    echo "⚠️  .env.local not found. Copying from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "📝 Please update .env.local with your database credentials:"
    echo "   - DATABASE_URL: Your PostgreSQL connection string"
    echo "   - PORT: Backend server port (default: 3001)"
    echo "   - NEXT_PUBLIC_API_URL: Backend API URL"
fi

# Database initialization prompt
echo ""
echo "Database Setup"
echo "================================"
echo "Have you already created your PostgreSQL database? (y/n)"
read -r db_ready

if [ "$db_ready" = "y" ]; then
    echo ""
    echo "Initialize database schema? (y/n)"
    read -r init_db
    if [ "$init_db" = "y" ]; then
        echo "📊 Initializing database..."
        # Run migration through Node.js
        npm run db:init 2>/dev/null || echo "ℹ️  Run 'npm run db:init' manually when ready"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"
echo ""
