#!/bin/bash

echo "🚀 Multi-Tenant Consolidation Tool - Setup Guide"
echo "================================================"
echo ""

echo "Step 1: Regenerate Prisma Client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo ""
echo "Step 2: Run database seed..."
npx tsx prisma/seed.ts
if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Failed to seed database"
    exit 1
fi

echo ""
echo "Step 3: Kill existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
echo "✅ Processes cleared"

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Demo Account Credentials:"
echo "   Email: demo@example.com"
echo "   Password: demo1234"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
echo "🌐 Then visit:"
echo "   • http://localhost:3000/auth/login - Login with demo account"
echo "   • http://localhost:3000/auth/register - Create your own account"
echo ""
echo "📚 Each customer has isolated data:"
echo "   • Demo account has 2 legal entities and 2 trial balance entries"
echo "   • New accounts start with empty data"
echo ""

