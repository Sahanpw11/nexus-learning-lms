# 📋 Deployment Checklist

Use this checklist to ensure successful deployment of Nexus Learning LMS.

## Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] `backend/package-lock.json` is committed and `npm run build` passes
- [ ] Package.json dependencies are correct
- [ ] No hardcoded credentials in code
- [ ] .gitignore configured properly
- [ ] README.md is complete

### Accounts Setup
- [ ] GitHub account created
- [ ] Neon account created
- [ ] Cloudflare account with R2 enabled
- [ ] Vercel account created

## Deployment Steps

### 1. GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or accessible
- [ ] Branch structure organized (main branch)

### 2. Vercel Deployment (one project, repository root)
- [ ] Neon project created; pooled (`-pooler`) connection string copied
- [ ] R2 bucket created (private), API token created, CORS policy allows the frontend origin
- [ ] Vercel project created with the repository root as root directory
- [ ] Environment variables configured (Production and Preview):
  - [ ] SECRET_KEY (strong, 32+ characters)
  - [ ] DATABASE_URL (Neon pooled URL)
  - [ ] NODE_ENV=production
  - [ ] R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
- [ ] Build successful (includes `npm run migrate`)
- [ ] Health check endpoint working (/health)
- [ ] Endpoint index accessible (/docs)

### 3. Frontend Check (same Vercel project)
- [ ] `/api/health` returns healthy
- [ ] Deep links (e.g. `/classes`) load the app after a refresh
- [ ] Application loads correctly
- [ ] No console errors

### 4. Database Setup
- [ ] Database initialized
- [ ] `npm run seed` executed in `backend/`
- [ ] Admin user created
- [ ] Sample users created (optional)
- [ ] Database connection stable

### 5. Cross-Service Configuration
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend API URL pointing to backend
- [ ] Both services redeployed with new configs
- [ ] HTTPS enabled on both services

## Post-Deployment Testing

### Authentication
- [ ] Login with admin credentials works
- [ ] Login with teacher credentials works
- [ ] Login with student credentials works
- [ ] Logout functionality works
- [ ] Token refresh works
- [ ] Protected routes enforce authentication

### Core Features
- [ ] Dashboard loads correctly for all roles
- [ ] Classes page displays and creates classes
- [ ] Assignments can be created and viewed
- [ ] Calendar displays events correctly
- [ ] Notes can be created and edited
- [ ] Analytics page shows data
- [ ] Students page lists users
- [ ] User management works (add/edit/delete)

### File Operations
- [ ] File downloads work
- [ ] Profile pictures upload (if implemented)

### API Integration
- [ ] Frontend connects to backend successfully
- [ ] No CORS errors in browser console
- [ ] API responses are received correctly
- [ ] Error messages display properly
- [ ] Loading states work

## Security Checklist

### Backend Security
- [ ] SECRET_KEY is strong and unique
- [ ] Database password is strong
- [ ] JWT tokens expire appropriately
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] SQL injection protection (all queries are parameterized)
- [ ] Rate limiting configured (optional)

### Frontend Security
- [ ] No sensitive data in client code
- [ ] Environment variables not exposed
- [ ] XSS protection enabled
- [ ] API tokens stored securely (localStorage)
- [ ] HTTPS enforced

### Database Security
- [ ] Database has strong password
- [ ] Database not publicly accessible
- [ ] Regular backups configured
- [ ] Connection pooling configured

## Performance Optimization

### Backend
- [ ] Database queries optimized
- [ ] Proper indexing on database tables
- [ ] Response caching (if needed)
- [ ] Connection pooling enabled

### Frontend
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading for routes
- [ ] Build size is reasonable (<5MB)

## Monitoring Setup

### Neon / R2
- [ ] Neon usage and connection count monitored
- [ ] R2 storage usage monitored
- [ ] Vercel function logs are accessible
- [ ] Error tracking configured
- [ ] Uptime monitoring enabled
- [ ] Resource usage monitored

### Vercel
- [ ] Analytics enabled
- [ ] Build notifications configured
- [ ] Error tracking enabled

## Documentation

- [ ] Deployment guide updated
- [ ] API documentation accessible
- [ ] User credentials documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide available

## Final Checks

- [ ] All links work correctly
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing done
- [ ] Page load times acceptable (<3s)
- [ ] No JavaScript errors in console
- [ ] All images and assets load
- [ ] Forms submit successfully
- [ ] Validation works on all forms

## Backup & Recovery

- [ ] Database backup strategy in place
- [ ] Recovery procedure documented
- [ ] Code backed up in GitHub
- [ ] Environment variables backed up securely

## Custom Domain (Optional)

- [ ] Domain purchased
- [ ] DNS configured for Vercel
- [ ] SSL certificate active
- [ ] www redirect configured
- [ ] Backend updated with new domain

## Maintenance Plan

- [ ] Update schedule defined
- [ ] Monitoring alerts configured
- [ ] Backup schedule established
- [ ] Support channels set up
- [ ] Issue tracking system ready

---

## Deployment Completed! 🎉

### Important URLs

**Production:**
- Frontend: https://your-app.vercel.app
- API: https://your-app.vercel.app/api
- Endpoint index: https://your-app.vercel.app/api/docs

**Credentials:**
- Admin: admin@reactorminds.com / admin123
- Teacher: teacher@example.com / teacher123
- Student: student@example.com / student123

### Next Steps

1. Change default passwords
2. Create real user accounts
3. Add real class data
4. Set up custom domain (optional)
5. Enable monitoring and alerts
7. Schedule regular backups

---

**Date Deployed:** ___________
**Deployed By:** ___________
**Environment:** Production
**Status:** ✅ Live
