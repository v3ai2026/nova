# Database Migration Guide

## Running Migrations

To apply the database migrations, run:

```bash
npx prisma migrate deploy
```

Or if you want to develop and create new migrations:

```bash
npx prisma migrate dev
```

## Current Migration

The migration `20251228213428_add_deployment_team_token_models` adds:

1. **Deployments table** - Track project deployments
2. **Teams table** - Team management
3. **TeamMembers table** - Team membership with roles
4. **ApiTokens table** - API token management
5. **Project updates** - Adds slug, repository_url, and status fields

## Prerequisites

Make sure your `.env` file contains the correct database connection strings:

```
POSTGRES_PRISMA_URL=your_connection_string
DATABASE_URL_UNPOOLED=your_direct_connection_string
```

## Generating Prisma Client

After schema changes, regenerate the Prisma client:

```bash
npx prisma generate
```
