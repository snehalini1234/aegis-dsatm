# GuardianFlow - Behavioral Authentication System

A behavioral authentication system using keystroke dynamics and mouse movement analysis.

## Project Structure

- **`/pages`** - Next.js frontend pages
- **`/api`** - Vercel serverless API functions
- **`/public`** - Static assets
- **`vercel.json`** - Vercel deployment configuration

## Deployment to Vercel

### Prerequisites
- GitHub account with the repository pushed
- Vercel account (free tier available)

### Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js framework
   - Click "Deploy"

### Environment Variables

If needed, add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Base URL for API calls

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Architecture Notes

### WebSocket Limitation
Vercel serverless functions don't support persistent WebSocket connections. For real-time functionality, consider:
- **Socket.io + Redis**: For horizontal scaling
- **Supabase Realtime**: PostgreSQL-based real-time updates
- **Dedicated Server**: Deploy backend on Railway, Render, or Heroku

### Current Features
- ✅ REST API endpoints for status and profiles
- ✅ Behavioral analytics collection
- ✅ User authentication with JWT
- ⚠️ WebSocket support requires separate backend

## API Routes

- `GET /api/status` - Health check
- `GET /api/profile/[userId]` - Get user profile
- `POST /api/profile/[userId]` - Update user profile
- `GET /api/socket` - WebSocket info (use dedicated server)

## Future Improvements

1. Add database integration (Supabase, MongoDB)
2. Implement Socket.io for real-time features
3. Add frontend components from `src.js`
4. Set up proper authentication flow
5. Add analytics dashboard

## Troubleshooting

**Build fails**: Ensure all Node.js files export default functions
**API calls fail**: Check CORS headers in `next.config.js`
**Performance issues**: Use Vercel Analytics to monitor
