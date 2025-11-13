#!/bin/bash
# Development startup script

echo "🚀 Starting Pi Log Manager Development Environment"
echo ""

# Check if backend is running
if ! curl -s http://localhost:8055/health > /dev/null 2>&1; then
    echo "⚠️  Backend not detected on port 8055"
    echo "Please start the backend first:"
    echo "  python manager.py"
    echo ""
    read -p "Press Enter to continue anyway or Ctrl+C to exit..."
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎨 Starting frontend development server..."
npm run dev
