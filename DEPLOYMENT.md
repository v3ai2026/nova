# Deployment Guide

This guide walks you through deploying the Nova application with the new database integration.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Supabase account for authentication
- Vercel account (or other hosting platform)

## Step 1: Environment Variables

Set up the following environment variables in your deployment platform:

```bash
# Database (Neon PostgreSQL)
POSTGRES_PRISMA_URL=postgresql://user:password@host/database?connect_timeout=15&sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host/database?sslmode=require

# Supabase Authentication
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Generate Prisma Client

```bash
npx prisma generate
```

## Step 4: Run Database Migrations

```bash
npx prisma migrate deploy
```

This will apply the migration that:
- Creates the `deployments` table
- Creates the `teams` table
- Creates the `team_members` table
- Creates the `api_tokens` table
- Updates the `projects` table with new fields

## Step 5: Verify Database Schema

```bash
npx prisma db pull
npx prisma validate
```

## Step 6: Build the Application

```bash
npm run build
```

## Step 7: Start the Application

For production:
```bash
npm run preview
```

For development:
```bash
npm run dev
```

## Step 8: Verify the Integration

Run the integration test script:
```bash
chmod +x scripts/test-integration.sh
./scripts/test-integration.sh
```

Or manually test:

1. **Health Check**: Visit `https://your-domain.com/api/health`
2. **Login**: Navigate to `/login` and authenticate
3. **Projects**: Create, view, and delete a project
4. **Deployments**: Deploy a project and view deployment history
5. **Tokens**: Create and delete API tokens
6. **Profile**: Update your user profile

## Deployment Platforms

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

Vercel will automatically:
- Install dependencies
- Run `npm run build`
- Set up serverless functions

**Important**: Add environment variables in Vercel dashboard before deploying.

### Other Platforms

For platforms like Netlify, Railway, or Render:

1. Set environment variables in platform dashboard
2. Set build command: `npm run build`
3. Set output directory: `.output`
4. Set start command: `node .output/server/index.mjs`

## Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] All environment variables set correctly
- [ ] Health endpoint returns 200 OK
- [ ] Can login with Supabase
- [ ] Can create projects
- [ ] Can create deployments
- [ ] Can create API tokens
- [ ] No console errors in browser
- [ ] All pages load correctly

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server" errors:

1. Check database URL is correct
2. Verify database is running and accessible
3. Check IP whitelist settings in database provider
4. Test connection with: `npx prisma db pull`

### Migration Issues

If migrations fail:

1. Check existing database schema
2. Reset database: `npx prisma migrate reset` (⚠️ destroys data)
3. Apply migrations: `npx prisma migrate deploy`

### Authentication Issues

If login fails:

1. Verify Supabase URL and keys
2. Check Supabase project is active
3. Verify redirect URLs in Supabase dashboard
4. Check browser console for errors

### API Route Issues

If API routes return 500 errors:

1. Check server logs for errors
2. Verify Prisma client is generated
3. Check database connection
4. Verify user authentication

## Rollback

If you need to rollback the changes:

1. Revert to previous commit
2. Run: `git revert HEAD`
3. Redeploy application
4. Optionally rollback database migrations

## Monitoring

After deployment, monitor:

- Application logs for errors
- Database query performance
- API response times
- Error rates

## Support

For issues or questions:
1. Check the INTEGRATION.md file
2. Review server logs
3. Test with the integration script
4. Check database connection

## Security Notes

- Never commit `.env` files
- Rotate API keys regularly
- Use environment-specific keys
- Enable row-level security in database
- Monitor for suspicious activity
