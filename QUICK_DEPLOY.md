# 🚀 Quick Deploy to Vercel - Nexus Learning LMS

## TL;DR - Fastest Way to Deploy

### 1. Push to GitHub (2 minutes)
```bash
cd e:\projects\LMS_2
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lms.git
git push -u origin main
```

### 2. Deploy Backend to Railway (3 minutes)
1. Go to https://railway.app/ → Login with GitHub
2. New Project → Deploy from GitHub → Select your repo
3. Add PostgreSQL database (click "+ New" → PostgreSQL)
4. Add environment variables:
   - `SECRET_KEY=your-secret-key-min-32-chars`
   - Railway auto-configures database variables
5. Copy your Railway URL (e.g., `https://xxx.up.railway.app`)

### 3. Deploy Frontend to Vercel (2 minutes)
1. Go to https://vercel.com/ → Login with GitHub
2. New Project → Import your repo
3. Configure:
   - Root Directory: `frontend`
   - Framework: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL=https://your-railway-url.up.railway.app`
5. Deploy!

### 4. Update Backend CORS (1 minute)
In Railway, add environment variable:
- `FRONTEND_URL=https://your-app.vercel.app`

### 5. Initialize Database (1 minute)
In Railway dashboard → Shell:
```bash
python setup_db.py
```

## ✅ Done!
Login at your Vercel URL with:
- Admin: `admin@reactorminds.com` / `admin123`
- Teacher: `teacher@example.com` / `teacher123`
- Student: `student@example.com` / `student123`

---

## 💰 Cost: $0/month (Free Tier)
Both Railway and Vercel offer generous free tiers perfect for development and small deployments.

## 📚 Need More Details?
See full deployment guide: `DEPLOYMENT.md`
