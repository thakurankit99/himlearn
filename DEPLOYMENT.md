# HimLearning Frontend Deployment Guide

This guide provides instructions for deploying the HimLearning frontend to Vercel.

## 🚀 Vercel Deployment

### Prerequisites
- A GitHub, GitLab, or Bitbucket account with your project repository
- A Vercel account (can sign up using your GitHub account)
- Backend already deployed and accessible via a public URL

### Steps

1. **Update API Configuration**

   Before deploying, update the API configuration to point to your deployed backend:

   Edit `src/config/api.js`:
   ```javascript
   const API_CONFIG = {
     development: {
       baseURL: 'http://localhost:5000/api',
       timeout: 30000
     },
     production: {
       baseURL: 'https://your-backend-url/api', // Update this URL
       timeout: 30000
     }
   };
   ```

2. **Sign up for Vercel**
   - Visit [vercel.com](https://vercel.com) and create an account
   - Connect your GitHub, GitLab, or Bitbucket account

3. **Import Your Project**
   - From the Vercel dashboard, click "Add New" → "Project"
   - Select your repository from the list
   - Configure the project:
     - Framework Preset: React
     - Root Directory: `Frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`

4. **Configure Environment Variables**
   - Add any necessary environment variables:
     - `CI=false` (to prevent treating warnings as errors)
     - `SKIP_PREFLIGHT_CHECK=true`
     - `DISABLE_ESLINT_PLUGIN=true`

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend application

6. **Access Your Application**
   - Once deployment is complete, Vercel will provide a URL
   - You can also configure a custom domain in the project settings

## 🔄 Continuous Deployment

Vercel automatically sets up continuous deployment:

- Any push to the `main` branch will trigger a production deployment
- Pull requests create preview deployments

## 🔧 Custom Domain Configuration

To use a custom domain:

1. Go to your project in the Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your domain and follow the verification steps
4. Update DNS settings with your domain registrar

## ⚙️ Environment Variables

For more advanced configurations, you may need these environment variables:

| Variable | Description |
|----------|-------------|
| `CI` | Set to `false` to prevent treating warnings as errors |
| `SKIP_PREFLIGHT_CHECK` | Set to `true` to skip dependency checks |
| `DISABLE_ESLINT_PLUGIN` | Set to `true` to disable ESLint during build |
| `REACT_APP_API_URL` | Optional override for API URL |

## 🔍 Troubleshooting

- **Build Failures**: Check the build logs for errors
- **API Connection Issues**: Verify the API URL is correct and the backend is accessible
- **CORS Errors**: Ensure your backend allows requests from your Vercel domain
- **White Screen**: Check for JavaScript errors in the browser console

## 📱 Testing Your Deployment

After deployment, test these key features:

1. User registration and login
2. Content creation and viewing
3. Image/video uploads
4. User profile management
5. Admin functionality (if applicable)

## 🔄 Updating Your Deployment

To update your deployment:

1. Push changes to your repository
2. Vercel will automatically rebuild and deploy
3. Check the deployment logs for any issues

For manual deployments, you can use the Vercel CLI:

```bash
npm i -g vercel
vercel login
cd Frontend
vercel --prod
``` 