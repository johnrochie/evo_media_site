# Website Upgrade Scanner - Installation Guide

## 📦 What's Included
A complete local dashboard for scanning websites that need upgrades and generating leads for Evolution Media (€500 website business).

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation Steps

1. **Copy files to your device**
   ```bash
   # Extract the package to your desired location
   mkdir website-upgrade-scanner
   cd website-upgrade-scanner
   # Copy all files here
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if you prefer yarn
   yarn install
   ```

3. **Start the scanner**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

4. **Access the dashboard**
   Open your browser and go to: http://localhost:4005

## 🔧 Configuration

### Port Configuration
Default port is 4005. To change it:
1. Edit `server.js` line: `const PORT = process.env.PORT || 4005;`
2. Or set environment variable: `PORT=5000 npm start`

### Environment Variables (Optional)
Create a `.env` file:
```env
PORT=4005
NODE_ENV=production
```

## 📊 Features

### Core Functionality
- **Real-time website analysis** - Scores websites 0-15
- **Automatic lead generation** - Websites scoring <10 become Evolution Media leads
- **Export functionality** - CSV export for outreach
- **Dashboard interface** - Clean, professional UI
- **Scan history** - Track all analyzed websites

### What It Analyzes
1. HTTPS/SSL security
2. Mobile responsiveness
3. Modern frameworks (React, Vue, etc.)
4. Contact information
5. Image accessibility
6. Page performance

## 💰 Business Value

### For Evolution Media
- Each lead = €500 website upgrade opportunity
- Automated lead generation
- Prioritized outreach (HIGH/MEDIUM/LOW priority)
- Direct integration with €500 website business model

### Example Workflow
1. Scan local business websites
2. Identify low-scoring sites (<10/15)
3. Export leads to CSV
4. Contact: "We can rebuild your website for €500 in 24 hours"
5. Convert to Evolution Media customers

## 🎯 Usage Examples

### Quick Test
```bash
# Start the server
npm start

# In another terminal, test the API
curl http://localhost:4005/api/health
```

### Sample Website Analysis
Try these in the dashboard:
- https://travelbug-v1.vercel.app
- https://reibridal-v1.vercel.app
- https://example.com

## 🔄 Maintenance

### Updating Dependencies
```bash
npm update
```

### Checking Logs
```bash
# View server logs
tail -f scanner.log
```

### Restarting Service
```bash
# Stop current process (Ctrl+C)
# Then restart
npm start
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in server.js or use:
   PORT=4006 npm start
   ```

2. **Dependencies fail to install**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Scanner not analyzing websites**
   - Check internet connection
   - Verify website URLs are accessible
   - Check server logs for errors

### Getting Help
Check the logs in `scanner.log` for detailed error information.

## 📈 Scaling Options

### For Production Use
1. Use PM2 for process management
   ```bash
   npm install -g pm2
   pm2 start server.js --name "website-scanner"
   ```

2. Add authentication (optional)
3. Connect to database for persistent storage
4. Add scheduled scanning

### Integration with Evolution Media
The scanner is designed to feed directly into the Evolution Media €500 website automation pipeline.

## 📁 File Structure
```
website-upgrade-scanner/
├── server.js              # Main server file
├── package.json          # Dependencies
├── public/               # Dashboard frontend
│   ├── index.html       # Dashboard interface
│   └── dashboard.js     # Frontend JavaScript
├── scanner.log          # Server logs (created at runtime)
└── INSTALL.md           # This file
```

## 🎉 Ready to Generate Leads!
Start scanning websites and generating €500 Evolution Media opportunities!
