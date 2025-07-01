# 📚 HimLearning Frontend

This is the frontend for the HimLearning educational platform, built with React.

## 🚀 Deployment on Vercel

This project is configured for easy deployment on Vercel.

### One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthakurankit99%2Fhimlearn&project-name=himlearning-frontend&repository-name=himlearning-frontend)

### Manual Deployment

1. Fork or clone this repository
2. Import the project into Vercel
3. Set the following environment variables:
   - `REACT_APP_API_URL`: `https://himlearnings.ankit.news/api`
   - `CI`: `false`
4. Deploy!

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔗 Backend API

This frontend connects to the HimLearning backend API at:
- Production: https://himlearnings.ankit.news/api
- Development: http://localhost:5000/api

## 📦 Tech Stack

- React
- React Router
- Axios
- Tailwind CSS
- CKEditor 