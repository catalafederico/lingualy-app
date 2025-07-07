# 🌍 Environment Setup Guide - Lingualy Frontend

This guide will help you set up the environment variables for the Lingualy frontend application.

## 📋 Required Environment Variables

The Lingualy frontend requires only **one environment variable**:

- **`NEXT_PUBLIC_API_URL`** - The URL of the backend API server

## 🚀 Quick Setup

### 1. Copy the Example File

```bash
cp .env.example .env.local
```

### 2. Edit the Configuration

Open `.env.local` and update the API URL:

```bash
# For local development
NEXT_PUBLIC_API_URL=http://localhost:3001

# For production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. Start the Development Server

```bash
npm run dev
```

## 🔧 Environment Files Explained

| File              | Purpose                             | Should Commit? |
| ----------------- | ----------------------------------- | -------------- |
| `.env.example`    | Template showing required variables | ✅ Yes         |
| `.env.local`      | Local development configuration     | ❌ No          |
| `.env.production` | Production configuration template   | ❌ No          |

## 🌐 Environment-Specific Configuration

### Local Development

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- Backend should be running on port 3001
- Make sure the backend `.env` has `FRONTEND_URL=http://localhost:3000`

### Staging/Development Server

```bash
NEXT_PUBLIC_API_URL=https://api-dev.yourdomain.com
```

### Production

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 🔒 Security Notes

### ✅ Safe for Frontend (NEXT*PUBLIC*)

- API URLs
- Feature flags
- Public configuration
- Analytics IDs

### ❌ Never Put in Frontend

- Database credentials
- API secrets
- Private keys
- Authentication secrets

## 🔗 Backend Integration

Make sure your backend (lingualy-api) is configured with:

```bash
# Backend .env
APP_PORT=3001
FRONTEND_URL=http://localhost:3000  # Your frontend URL
```

## 🚨 Troubleshooting

### API Connection Issues

1. Check that `NEXT_PUBLIC_API_URL` matches your backend URL
2. Verify the backend is running on the specified port
3. Check CORS configuration in the backend
4. Ensure no firewall is blocking the connection

### Build Issues

1. Make sure all required environment variables are set
2. Check that there are no syntax errors in your `.env.local`
3. Restart the development server after changing environment variables

### Production Deployment

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Don't commit `.env.local` or `.env.production` files
3. Use your hosting platform's environment variable interface

## 📚 Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Lingualy Backend Environment Setup](../lingualy-api/.env.example)
- [CORS Configuration Guide](../lingualy-api/src/main.ts)
