# Prisma Migration Guide - IAM Context

## Overview
This guide covers the step-by-step migration from raw PostgreSQL queries to Prisma ORM for the IAM bounded context, maintaining the hexagonal architecture principles.

## Pre-Migration Checklist

### 1. Install Dependencies
```bash
cd backend/
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Environment Setup
- Copy `.template-env` to `.development.env`
- Set `USE_PRISMA_FOR_IAM=false` initially for safe rollback
- Configure `DATABASE_URL` for your PostgreSQL instance

### 3. Database Schema Analysis
Current PostgreSQL table structure:
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  last_login TIMESTAMP NOT NULL
);
```

## Migration Steps

### Step 1: Install Dependencies
```bash
# From root directory (recommended - uses pnpm workspace)
pnpm --filter=backend add prisma @prisma/client uuidv7
pnpm --filter=backend add -D @types/uuid

# Or from backend/ directory directly
cd backend/
pnpm add prisma @prisma/client uuidv7
pnpm add -D @types/uuid
```

### Step 2: Initialize Prisma
```bash
npx prisma init
```

### Step 3: Configure Schema with UUID v7
Update `prisma/schema.prisma` with the provided schema (already created with UUID v7 support)

### Step 4: Introspect Existing Database
```bash
# Pull current database schema
npx prisma db pull

# Review generated schema and adjust if needed
```

### Step 5: Create Initial Migration
```bash
# Generate migration files
npx prisma migrate dev --name init_iam_context

# Generate Prisma client
npx prisma generate
```

### Step 6: Install Prisma Components
All necessary files have been created:
- `src/lib/infra/prisma/prisma.service.ts` - Full lifecycle management
- `src/lib/infra/prisma/prisma.module.ts` - Global module setup  
- `src/lib/infra/prisma/uuid-v7.util.ts` - UUID v7 utility with time-ordering
- `src/bounded-contexts/iam/iam/repository/user-write.prisma.repository.ts` - Repository with UUID v7 support
- `prisma/seed.ts` - Database seeding with UUID v7 examples
- Updated `iam.module.ts` with factory pattern

### Step 7: Test Installation
```bash
# From root directory (workspace command)
pnpm --filter=backend test

# Or run specific tests
pnpm --filter=backend test prisma.repository.spec.ts

# Interactive test UI
pnpm --filter=backend test:ui
```

### Step 8: Enable Prisma (Feature Flag)
In `.development.env`:
```env
USE_PRISMA_FOR_IAM=true
```

### Step 9: Verify Migration
```bash
# Start the application (from root)
pnpm --filter=backend start:dev

# Or start full stack
pnpm dev

# Test authentication endpoints:
# POST /auth/register
# POST /auth/login
# GET /auth/profile

# Monitor logs for "Using Prisma repository for IAM context"
```

### Step 10: Performance Testing
Compare performance between implementations:
- Monitor query execution times in logs
- Test under load if needed
- Verify JWT-based authorization still works

### Step 11: Seed Database with UUID v7 Examples
```bash
# Run the seed script to create test users with UUID v7 (from root)
pnpm prisma:seed

# Or from backend directory
pnpm --filter=backend prisma:seed
```

### Step 12: Cleanup (Optional)
Once satisfied with Prisma implementation:
- Remove the factory pattern if no longer needed
- Remove the old PostgreSQL repository
- Clean up unused imports

## Rollback Plan

If issues arise:
1. Set `USE_PRISMA_FOR_IAM=false` in environment
2. Restart application
3. System falls back to original PostgreSQL implementation
4. Investigate and fix Prisma issues

## Additional Prisma Commands

```bash
# View database in Prisma Studio (from root)
pnpm prisma:studio

# Reset database (careful!)
pnpm --filter=backend prisma:reset

# Deploy migrations to production
pnpm --filter=backend prisma:deploy

# Generate client after schema changes
pnpm prisma:generate
```

## UUID v7 Benefits for DDD/CQRS Systems

### Database Performance
- **Time-Ordered**: UUIDs sort chronologically, perfect for event sourcing
- **Index Efficiency**: Reduces B-tree fragmentation in PostgreSQL indexes  
- **Insert Performance**: Sequential nature improves insertion speed
- **Storage Optimization**: Better page utilization than random UUIDs

### Domain-Driven Design Integration
- **Event Ordering**: Domain events naturally ordered by generation time
- **Aggregate History**: Temporal queries using UUID timestamp extraction
- **Audit Trails**: Built-in timestamp for when entities were created
- **Cross-Context Correlation**: Time-based correlation across bounded contexts

### CQRS & Event Sourcing
- **Event Store**: Natural ordering for event replay and projections
- **Read Models**: Time-based partitioning and filtering
- **Saga Orchestration**: Chronological saga step tracking
- **Integration Events**: Cross-context event ordering preservation

### Code Examples
```typescript
// Generate time-ordered IDs for domain events
const eventId = UUIDv7.generate();

// Extract creation timestamp for temporal queries
const createdAt = UUIDv7.extractTimestamp(eventId);

// Sort events chronologically 
const sortedEvents = UUIDv7.sort(eventIds);

// Time-range queries become possible
const recentEvents = events.filter(e => 
  UUIDv7.extractTimestamp(e.id) > startTime
);
```

## Architecture Benefits Maintained

✅ **Hexagonal Architecture**: Prisma repository implements the same `UserWriteRepoPort`  
✅ **Domain Driven Design**: Entity mapping preserved with `toPrimitives()` and `fromPrimitives()`  
✅ **CQRS**: Separate read/write concerns maintained  
✅ **Event Driven**: Domain events still published after persistence  
✅ **Authorization**: JWT-based user validation preserved  
✅ **Testability**: Mock-based testing strategy maintained  

## Monitoring & Observability

- Prisma queries logged at DEBUG level
- Transaction boundaries clearly defined
- Domain events tracked per operation
- Error handling with specific Prisma error codes
- Performance metrics available in Prisma Studio

## Next Steps

After successful IAM migration:
1. Consider Prisma for Marketing context (simple user email repository)
2. Evaluate Prisma for event sourcing (JSON columns for domain events)
3. Explore Prisma's multi-database support for unified data access
4. Consider Prisma Migrate for database versioning in CI/CD

## Support

- Prisma Documentation: https://www.prisma.io/docs
- NestJS Prisma Integration: https://docs.nestjs.com/recipes/prisma
- Hexagonal Architecture with Prisma: Repository pattern best practices