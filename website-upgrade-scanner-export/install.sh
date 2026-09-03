#!/bin/bash

# Website Upgrade Scanner Installer
echo "🚀 Installing Website Upgrade Scanner..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version too old. Please upgrade to Node.js 16+."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
    
    # Create start script
    cat > start-scanner.sh << 'STARTEOF'
#!/bin/bash
echo "🚀 Starting Website Upgrade Scanner..."
echo "🌐 Dashboard will be available at: http://localhost:4005"
echo "📊 API Health: http://localhost:4005/api/health"
echo ""
echo "Press Ctrl+C to stop the scanner"
echo ""
npm start
STARTEOF
    
    chmod +x start-scanner.sh
    
    echo ""
    echo "🎉 Installation complete!"
    echo ""
    echo "To start the scanner:"
    echo "  ./start-scanner.sh"
    echo ""
    echo "Or manually:"
    echo "  npm start"
    echo ""
    echo "📖 See INSTALL.md for full documentation"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
