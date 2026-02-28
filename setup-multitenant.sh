#!/bin/bash

# Multi-Tenant Setup Script for Consolidation Tool
echo "🚀 Setting up Multi-Tenant Consolidation Tool..."
echo ""

# Step 1: Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Step 2: Run Database Migration
echo "🗄️  Running database migration..."
npx prisma migrate dev --name add_multi_tenant_support

# Step 3: Kill existing Next.js processes
echo "🔄 Stopping existing server..."
pkill -f "next dev" 2>/dev/null || true

# Step 4: Start the development server
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  npm run dev"
echo ""
echo "Then navigate to:"
echo "  http://localhost:3000/auth/register - Register new account"
echo "  http://localhost:3000/auth/login - Login"
echo ""

