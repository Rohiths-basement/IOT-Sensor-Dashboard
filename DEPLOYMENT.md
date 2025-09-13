# 🚀 Vercel Deployment Guide

## Overview
This guide will help you deploy your Agricultural Sensor Dashboard to Vercel with SQLite database support.

## 📋 Prerequisites
- Vercel account (free tier works)
- GitHub repository (already set up)
- Vercel CLI (optional but recommended)

## 🔧 Configuration Changes Made

### 1. **Serverless API Functions**
- Converted Express.js backend to Vercel serverless functions
- Created `/api` directory with individual function files:
  - `api/health.js` - Health check endpoint
  - `api/readings.js` - GET/POST readings endpoint  
  - `api/readings/latest.js` - Latest readings endpoint
  - `api/db.js` - Database initialization and sample data

### 2. **SQLite Configuration**
- **In-memory database**: Uses `:memory:` for serverless compatibility
- **Auto-initialization**: Database recreates with sample data on each cold start
- **Sample data**: 300+ readings across 12 devices generated automatically
- **No persistence**: Database resets on each deployment (as requested)

### 3. **Frontend Configuration**
- **Dynamic API URL**: Automatically switches between local and production
- **Production**: Uses `/api` endpoints
- **Development**: Uses `http://localhost:3001/api`

### 4. **Vercel Configuration** (`vercel.json`)
- **Build command**: Builds React frontend automatically
- **Output directory**: Points to `frontend/build`
- **API routing**: Routes `/api/*` to serverless functions
- **SPA routing**: All other routes serve `index.html`

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   ```
   1. Go to https://vercel.com/dashboard
   2. Click "New Project"
   3. Import from GitHub: Rohiths-basement/IOT-Sensor-Dashboard
   4. Configure project settings (Vercel will auto-detect)
   ```

2. **Deploy**
   ```
   1. Click "Deploy"
   2. Wait for build to complete (~2-3 minutes)
   3. Your app will be live at: https://your-project-name.vercel.app
   ```

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd "/Users/rohiths/Desktop/Projects/Sensor Data dashboard"
   vercel
   ```

4. **Follow prompts**
   ```
   ? Set up and deploy? Yes
   ? Which scope? (your-username)
   ? Link to existing project? No
   ? What's your project's name? iot-sensor-dashboard
   ? In which directory is your code located? ./
   ```

## 🔍 How It Works

### **Database Behavior**
- **Cold starts**: New database instance with fresh sample data
- **Warm requests**: Same database instance persists temporarily
- **Deployments**: Complete database reset with new sample data
- **No data loss concern**: Sample data regenerates automatically

### **API Endpoints** (Production)
- `GET /api/health` - Service health check
- `GET /api/readings` - All readings (last 24 hours)
- `GET /api/readings/latest` - Latest reading per device
- `POST /api/readings` - Add new reading

### **Sample Data**
- **12 devices**: GH001 through GH012
- **300+ readings**: 7 days of historical data
- **Realistic patterns**: Daily cycles, variations, alert conditions
- **Auto-generated**: Fresh data on every deployment

## ✅ Testing Deployment

### 1. **Frontend Test**
```
Visit: https://your-app.vercel.app
- Should load dashboard with overview section
- Device filtering should work in nitrogen chart
- Pagination should function properly
```

### 2. **API Test**
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Get readings
curl https://your-app.vercel.app/api/readings

# Get latest readings
curl https://your-app.vercel.app/api/readings/latest
```

### 3. **Add Reading Test**
```bash
curl -X POST https://your-app.vercel.app/api/readings \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "GH001",
    "timestamp": "2025-01-14T10:30:00Z",
    "nitrogen": 150.5,
    "phosphorus": 45.2,
    "ph": 6.5
  }'
```

## 🐛 Troubleshooting

### **Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common issues:
- Missing dependencies in package.json
- Frontend build errors
- API function syntax errors
```

### **API Not Working**
```bash
# Check function logs in Vercel dashboard
# Verify API endpoints:
curl https://your-app.vercel.app/api/health
```

### **Database Issues**
```bash
# Database recreates on each cold start
# No persistent storage needed
# Sample data generates automatically
```

### **CORS Issues**
```bash
# Should not occur - same origin in production
# API and frontend served from same domain
```

## 📊 Performance Notes

- **Cold start**: ~2-3 seconds for first request
- **Warm requests**: ~100-300ms response time
- **Database size**: In-memory, ~1MB sample data
- **Function timeout**: 10 seconds max duration
- **Concurrent requests**: Handled by Vercel automatically

## 🔄 Updates & Redeployment

### **Automatic Deployment**
```bash
# Any push to main branch triggers redeployment
git add .
git commit -m "Update feature"
git push origin master
```

### **Manual Deployment**
```bash
# Using Vercel CLI
vercel --prod
```

## 🎯 Production URL
After deployment, your app will be available at:
**https://iot-sensor-dashboard-[random].vercel.app**

The database will reset with fresh sample data on each deployment, ensuring consistent demo experience.
