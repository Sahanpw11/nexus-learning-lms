# 🚀 Deployment Guide - Nexus Learning LMS

## Overview
This guide covers deploying the LMS with:
- **Frontend**: Vercel (React)
- **Backend**: Railway/Render (FastAPI)
- **Database**: Railway PostgreSQL / Supabase

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account OR Render account (free tier available)
- Firebase project (for file storage - optional)

---

## PART 1: Deploy Backend (Railway - Recommended)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   cd e:\projects\LMS_2
   git init
   git add .
   git commit -m "Initial commit - Nexus Learning LMS"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nexus-learning-lms.git
   git push -u origin main
   ```

### Step 2: Deploy on Railway

1. **Go to Railway.app**
   - Visit https://railway.app/
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `nexus-learning-lms` repository
   - Select the `backend` folder as root directory

3. **Add PostgreSQL Database**
   - In your Railway project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create a database

4. **Configure Environment Variables**
   Click on your backend service → "Variables" tab:
   
   ```env
   # Database (Railway provides these automatically)
   POSTGRES_USER=${{Postgres.PGUSER}}
   POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
   POSTGRES_SERVER=${{Postgres.PGHOST}}
   POSTGRES_PORT=${{Postgres.PGPORT}}
   POSTGRES_DB=${{Postgres.PGDATABASE}}
   
   # JWT Configuration
   SECRET_KEY=your-super-secret-key-min-32-chars-change-this
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # CORS (Add your Vercel URL after frontend deployment)
   CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
   FRONTEND_URL=https://your-app.vercel.app
   
   # Environment
   ENVIRONMENT=production
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL: `https://your-app.up.railway.app`

6. **Initialize Database**
   - Go to Railway dashboard → Your backend service
   - Open "Settings" → "Deploy Trigger"
   - Or run setup script via Railway CLI:
   ```bash
   railway run python setup_db.py
   ```

### Step 3: Alternative - Deploy on Render.com

1. **Go to Render.com**
   - Visit https://render.com/
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: nexus-learning-api
     - **Root Directory**: backend
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Link to your web service

4. **Set Environment Variables** (same as Railway above)

5. **Deploy**
   - Render will build and deploy automatically
   - Get your URL: `https://nexus-learning-api.onrender.com`

---

## PART 2: Deploy Frontend (Vercel)

### Step 1: Update API Configuration

1. **Create environment file** (`frontend/.env.production`):
   ```env
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

2. **Update API service** (`frontend/src/services/api.js`):
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel**
   - Visit https://vercel.com/
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**
   Add in Vercel dashboard → Settings → Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Get your URL: `https://nexus-learning.vercel.app`

### Step 3: Update Backend CORS

Go back to Railway/Render and update the `CORS_ORIGINS` environment variable:
```env
CORS_ORIGINS=https://nexus-learning.vercel.app,http://localhost:3000
FRONTEND_URL=https://nexus-learning.vercel.app
```

---

## PART 3: Post-Deployment Setup

### Step 1: Initialize Database

Run the setup script on Railway/Render:

**Railway CLI:**
```bash
railway login
railway link
railway run python setup_db.py
```

**Render Dashboard:**
- Go to Shell tab
- Run: `python setup_db.py`

This creates:
- Admin: `admin@reactorminds.com` / `admin123`
- Teacher: `teacher@example.com` / `teacher123`
- Student: `student@example.com` / `student123`

### Step 2: Configure Firebase (Optional)

If using Firebase for file storage:

1. Create Firebase project
2. Download service account JSON
3. On Railway/Render, add as environment variable:
   ```env
   FIREBASE_CREDENTIALS_JSON='{"type": "service_account", ...}'
   ```
4. Update backend code to read from env variable instead of file

### Step 3: Test Your Deployment

1. Visit your Vercel URL
2. Login with test credentials
3. Test all features:
   - User authentication
   - Class creation
   - Assignment submission
   - File uploads
   - Real-time updates

---

## 🔧 Troubleshooting

### Backend Issues

**"ModuleNotFoundError"**
- Ensure `requirements.txt` is complete
- Check Railway/Render build logs

**"Database connection failed"**
- Verify environment variables
- Check database is running
- Ensure DATABASE_URL is correct

**"CORS errors"**
- Add your Vercel URL to CORS_ORIGINS
- Restart backend service

### Frontend Issues

**"Network Error" or "Failed to fetch"**
- Check REACT_APP_API_URL is correct
- Verify backend is running
- Check browser console for CORS errors

**"Blank page after deployment"**
- Check Vercel build logs
- Verify build command is correct
- Check for JavaScript errors in console

---

## 📊 Monitoring & Maintenance

### Railway/Render
- Monitor logs in dashboard
- Set up alerts for errors
- Check database usage
- Monitor API response times

### Vercel
- Check Analytics dashboard
- Monitor build times
- Check deployment logs
- Set up domain (optional)

---

## 🔒 Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use strong database passwords
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set up environment variables properly
- [ ] Never commit .env files
- [ ] Enable rate limiting (optional)
- [ ] Set up database backups
- [ ] Configure firewall rules

---

## 💰 Cost Estimates

### Free Tier Limits

**Railway:**
- $5 free credit monthly
- ~500 hours runtime
- Perfect for development/small projects

**Render:**
- Free tier available
- 750 hours/month
- Spins down after inactivity (slow first load)

**Vercel:**
- 100 GB bandwidth
- Unlimited deployments
- Perfect for frontend

### Paid Plans (Optional)

**Railway**: $5-20/month for production
**Render**: $7/month for always-on service
**Vercel**: $20/month Pro (optional)

---

## 🚀 Quick Start Commands

### Local Development
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python setup_db.py
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
```

### Deploy Updates
```bash
# Just push to GitHub - auto-deploys!
git add .
git commit -m "Update features"
git push
```

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

## 🎉 You're Done!

Your LMS is now live and accessible worldwide! 

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-api.railway.app
**Docs**: https://your-api.railway.app/docs

Happy teaching! 🎓
