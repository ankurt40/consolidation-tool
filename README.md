# Consolidation Tool

A Next.js application with Supabase (PostgreSQL) database integration and Prisma ORM demonstrating employee directory management with automated migrations.

## Features

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Next.js API Routes
- **ORM**: Prisma with automated migrations (Liquibase-style)
- **Database**: Supabase PostgreSQL (or local PostgreSQL via Docker)
- **Sample Data**: 5 employees pre-loaded via seed script

## Prerequisites

- Node.js 20+
- npm
- Supabase account (free tier available at https://supabase.com)
- Docker (optional, for local database development)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Quick Start with Supabase

### 1. Set Up Supabase Connection

**📖 See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions**

1. Create a Supabase project at https://supabase.com
2. Get your connection strings from Project Settings > Database
3. Update `.env` file with your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Run Database Migrations

This will create the employee table in your Supabase database:

```bash
npm run db:migrate
```

When prompted, enter a migration name like: `initial_employee_table`

The seed script will automatically run and populate 5 sample employees.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the employee directory!

## Alternative: Local Development with Docker

If you prefer a local PostgreSQL database:

### 1. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

### 2. Update .env for Local Database

```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/consolidation_db"
DIRECT_URL="postgresql://admin:admin123@localhost:5432/consolidation_db"
```

### 3. Run Migrations and Seed

```bash
npm run db:migrate
```

### 4. Start the App

```bash
npm run dev
```

## Project Structure

```
consolidation-tool/
├── app/
│   ├── api/
│   │   └── employees/
│   │       └── route.ts          # API endpoint to fetch employees
│   ├── page.tsx                   # Home page displaying employees
│   └── layout.tsx                 # Root layout
├── lib/
│   └── db.ts                      # Prisma client singleton
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   ├── seed.ts                    # Database seeding script
│   └── migrations/                # Migration history (auto-generated)
├── types/
│   └── employee.ts                # Employee TypeScript interface
├── docker-compose.yml             # Docker configuration for local PostgreSQL
├── SUPABASE_SETUP.md              # Detailed Supabase setup guide
└── .env                           # Environment variables (DO NOT COMMIT!)
```

## Database Management Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma Client from schema |
| `npm run db:migrate` | Create and apply migration (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## Prisma Schema

The database schema is defined in `prisma/schema.prisma`:

```prisma
model Employee {
  id         Int      @id @default(autoincrement())
  name       String   @db.VarChar(100)
  email      String   @unique @db.VarChar(100)
  position   String   @db.VarChar(100)
  department String   @db.VarChar(100)
  createdAt  DateTime @default(now()) @map("created_at")

  @@map("employee")
}
```

## Database Migrations (Like Liquibase)

Prisma Migrate provides version-controlled database migrations similar to Liquibase:

### Creating a Migration

1. Modify `prisma/schema.prisma`
2. Run: `npm run db:migrate`
3. Enter a descriptive name (e.g., "add_salary_column")
4. Prisma generates SQL and applies it to your database

### Migration Files

All migrations are stored in `prisma/migrations/` with:
- Timestamp-based folders
- SQL files with actual changes
- Migration history tracked in `_prisma_migrations` table

### Production Deployment

```bash
npm run db:migrate:deploy
```

This applies all pending migrations in production without prompts.

## API Endpoints

### GET /api/employees

Fetches the list of employees (limited to 5).

**Response:**
```json
{
  "success": true,
  "employees": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@company.com",
      "position": "Software Engineer",
      "department": "Engineering",
      "created_at": "2026-02-21T..."
    }
  ]
}
```

## Environment Variables

Create a `.env` file in the project root:

### For Supabase (Production/Cloud):

```env
# Connection Pooling (for queries)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (for migrations)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### For Local Development (Docker):

```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/consolidation_db"
DIRECT_URL="postgresql://admin:admin123@localhost:5432/consolidation_db"
```

**⚠️ Never commit .env files to git!** The file is already in `.gitignore`.

## Stopping the Application

To stop the Next.js server, press `Ctrl+C` in the terminal.

To stop and remove the PostgreSQL container:

```bash
docker-compose down
```

To stop and remove everything including the database volume:

```bash
docker-compose down -v
```

## Troubleshooting

### Supabase Connection Issues

**Error: "Can't reach database server"**
- Verify your connection strings in `.env`
- Check your database password
- Ensure Supabase project is active

**Error: "Connection pool timeout"**
- Use Connection Pooling URL for `DATABASE_URL`
- Check Supabase connection limits

### Migration Issues

**Apply a specific migration:**
```bash
npx prisma migrate resolve --applied <migration-name>
```

**Reset database (WARNING: deletes all data!):**
```bash
npx prisma migrate reset
```

### Local Docker Issues

If using local PostgreSQL:

1. Make sure Docker is running
2. Check container status: `docker-compose ps`
3. View logs: `docker-compose logs postgres`
4. Restart: `docker-compose restart postgres`

## Development Workflow

### Adding a New Field to Employee

1. **Update the schema** in `prisma/schema.prisma`:
```prisma
model Employee {
  // ...existing fields...
  salary Int @default(0)  // NEW FIELD
}
```

2. **Create migration**:
```bash
npm run db:migrate
```
Name it: `add_salary_field`

3. **Prisma generates the client automatically**

4. **Use in your code**:
```typescript
const employee = await prisma.employee.create({
  data: {
    name: "John",
    email: "john@example.com",
    position: "Engineer",
    department: "Engineering",
    salary: 100000  // New field!
  }
});
```

### Viewing Database Contents

**Option 1: Prisma Studio (Recommended)**
```bash
npm run db:studio
```
Opens a GUI at http://localhost:5555

**Option 2: Supabase Dashboard**
- Go to your Supabase project
- Click "Table Editor" in sidebar
- Browse the `employee` table

**Option 3: Local PostgreSQL (Docker)**
```bash
docker exec -it consolidation-db psql -U admin -d consolidation_db
```
```sql
SELECT * FROM employee;
```

## Technologies Used

- **Next.js 16**: React framework with App Router and Turbopack
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma ORM**: Type-safe database client with migrations
- **Supabase**: PostgreSQL database (BaaS)
- **PostgreSQL**: Relational database
- **Docker**: Local development database (optional)

## Why Prisma Over Raw SQL?

✅ **Type Safety**: Auto-generated TypeScript types  
✅ **Migrations**: Version-controlled schema changes (like Liquibase)  
✅ **Developer Experience**: Auto-complete and IntelliSense  
✅ **Query Builder**: Cleaner, more maintainable queries  
✅ **Consistency**: Same API across different databases

## Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`: Your Supabase pooling connection string
   - `DIRECT_URL`: Your Supabase direct connection string
4. Deploy!

Vercel automatically runs `npm run db:migrate:deploy` during build.

### Other Platforms

For Railway, Render, etc.:
1. Set `DATABASE_URL` and `DIRECT_URL` environment variables
2. Add build command: `npm run build`
3. Add start command: `npm start`
4. Ensure migrations run: `npm run db:migrate:deploy && npm start`

## Stopping the Application

**Stop Next.js dev server**: Press `Ctrl+C`

**Stop local Docker database**:
```bash
docker-compose down
```

**Stop and remove database volume**:
```bash
docker-compose down -v
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
