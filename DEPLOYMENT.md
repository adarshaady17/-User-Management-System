# Deployment Guide

Complete guide for deploying the User Management System to Render (Backend) and Vercel (Frontend).

## Prerequisites

- GitHub account
- Render account (sign up at [render.com](https://render.com))
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account (sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/user-management-system.git
   git push -u origin main
   ```

2. **Make sure these files are in your repository:**
   - `render.yaml` (for Render)
   - `frontend/vercel.json` (for Vercel)
   - All source code files
   - `.gitignore` files (to exclude `.env` files)

---

## Step 2: Deploy Backend to Render

### 2.1 Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (Free tier is fine)
4. Wait for cluster to be created (3-5 minutes)
5. Click **"Connect"** on your cluster
6. Choose **"Connect your application"**
7. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
8. Replace `<password>` with your database user password
9. Click **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** (0.0.0.0/0)

### 2.2 Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Review the configuration and click **"Apply"**
6. Go to the service settings and add environment variables (see below)

#### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `user-management-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** Leave empty (or set to repository root)

### 2.3 Set Environment Variables in Render

Go to your Render service → **Environment** tab → Add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port (Render sets this automatically, but include it) |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-super-secret-key-here` | Generate a strong random string |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Your Vercel frontend URL (set after frontend deployment) |

**To generate JWT_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 2.4 Deploy

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for deployment to complete (2-5 minutes)
3. Copy your backend URL (e.g., `https://user-management-backend.onrender.com`)
4. Test the health endpoint: `https://your-backend-url.onrender.com/health`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `dist` (should auto-detect)
   - **Install Command:** `npm install` (should auto-detect)

### 3.2 Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** → Add:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` | Your Render backend URL + `/api` |

**Important:** Replace `your-backend-url.onrender.com` with your actual Render backend URL.

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Copy your frontend URL (e.g., `https://user-management-system.vercel.app`)

### 3.4 Update Backend CORS

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-vercel-app.vercel.app` (your actual Vercel URL)
3. Redeploy the backend service (or it will auto-redeploy)

---

## Step 4: Create Admin User

After deployment, create an admin user:

### Option 1: Using Script (Local)

1. Update your local `backend/.env` with production MongoDB URI:
   ```env
   MONGO_URI=your-production-mongodb-uri
   ```

2. Run the create-admin script:
   ```bash
   cd backend
   npm run create-admin
   ```

### Option 2: Using MongoDB Atlas

1. Go to MongoDB Atlas → **Browse Collections**
2. Find your database → `users` collection
3. Click **"Insert Document"**
4. Add a document:
   ```json
   {
     "fullName": "Admin User",
     "email": "admin@example.com",
     "password": "$2a$10$hashedpasswordhere",
     "role": "admin",
     "status": "active",
     "createdAt": "2024-01-01T00:00:00.000Z",
     "updatedAt": "2024-01-01T00:00:00.000Z"
   }
   ```
   **Note:** You need to hash the password first. Use the script method instead.

### Option 3: First User Signup

1. Go to your deployed frontend
2. Sign up as the first user
3. You'll automatically become admin

---

## Step 5: Verify Deployment

### Backend Health Check

Visit: `https://your-backend-url.onrender.com/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Frontend

1. Visit your Vercel URL
2. You should see the login page
3. Try signing up or logging in
4. Test admin dashboard access

### Test API Endpoints

Use Postman or curl to test:

```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Signup
curl -X POST https://your-backend-url.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"Test1234"}'
```

---

## Environment Variables Summary

### Backend (Render)

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Troubleshooting

### Backend Issues

**Problem: Build fails**
- Check that `package.json` has correct `start` script
- Verify Node.js version (Render uses Node 18+ by default)

**Problem: Database connection fails**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access (IP whitelist)
- Ensure password in connection string is URL-encoded

**Problem: CORS errors**
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check that CORS middleware is configured correctly
- Ensure no trailing slashes mismatch

### Frontend Issues

**Problem: API calls fail**
- Verify `VITE_API_URL` is set correctly in Vercel
- Check browser console for CORS errors
- Ensure backend is deployed and accessible

**Problem: Blank page**
- Check browser console for errors
- Verify build completed successfully
- Check that `dist` folder contains built files

**Problem: Environment variables not working**
- Vite requires `VITE_` prefix for environment variables
- Redeploy after adding environment variables
- Clear browser cache

### Common Issues

**Problem: 404 errors on refresh (Vercel)**
- `vercel.json` should have rewrite rules (already included)
- Verify SPA routing is configured

**Problem: Slow first request (Render)**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid plan for always-on service

---

## Post-Deployment Checklist

- [ ] Backend health check endpoint works
- [ ] Frontend loads correctly
- [ ] Can sign up new users
- [ ] Can login with credentials
- [ ] Admin dashboard accessible (if admin user exists)
- [ ] User profile page works
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Admin user created
- [ ] MongoDB connection working
- [ ] JWT authentication working

---

## Updating Your Deployment

### Backend Updates

1. Push changes to GitHub
2. Render will auto-deploy (if auto-deploy is enabled)
3. Or manually trigger deployment in Render dashboard

### Frontend Updates

1. Push changes to GitHub
2. Vercel will auto-deploy
3. Check deployment logs in Vercel dashboard

---

## URLs to Update in README

After deployment, update these in your README.md:

- Frontend URL: `https://your-app.vercel.app`
- Backend API URL: `https://your-backend-url.onrender.com/api`
- Health Check: `https://your-backend-url.onrender.com/health`

---

## Security Notes

- ✅ Never commit `.env` files to Git
- ✅ Use strong `JWT_SECRET` (32+ characters)
- ✅ Keep MongoDB credentials secure
- ✅ Use HTTPS (both Render and Vercel provide this)
- ✅ Regularly update dependencies
- ✅ Monitor your Render and Vercel dashboards

---

## Support

If you encounter issues:

1. Check Render deployment logs
2. Check Vercel deployment logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Test API endpoints directly with Postman/curl

---

**Happy Deploying! 🚀**

