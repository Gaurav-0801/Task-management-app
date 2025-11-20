# Docker Setup Guide

## Prerequisites
- Docker and Docker Compose installed on your system
- PostgreSQL will run in a container, no local installation needed

## Quick Start

### 1. Create Environment File
\`\`\`bash
cp .env.example .env
\`\`\`

### 2. Start Services
\`\`\`bash
docker-compose up -d
\`\`\`

This command will:
- Create and start a PostgreSQL database container
- Build and start the application container
- Initialize the database with the schema from `scripts/init-db.sql`
- Run the application on ports 3000 (Next.js) and 3001 (Express API)

### 3. Verify Services
\`\`\`bash
# Check if containers are running
docker-compose ps

# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f db
\`\`\`

### 4. Access Application
- Frontend: http://localhost:3000
- API Health Check: http://localhost:3001/health

## Common Commands

### Stop Services
\`\`\`bash
docker-compose down
\`\`\`

### Rebuild Application
\`\`\`bash
docker-compose up -d --build
\`\`\`

### View Logs
\`\`\`bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
\`\`\`

### Connect to Database
\`\`\`bash
docker exec -it task-management-db psql -U postgres -d tasks_db
\`\`\`

### Run Database Migrations
\`\`\`bash
docker exec task-management-db psql -U postgres -d tasks_db -f /docker-entrypoint-initdb.d/init.sql
\`\`\`

## Environment Variables

Configure in `.env` file:
- `DATABASE_URL` - PostgreSQL connection string
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `NODE_ENV` - Environment (development/production)
- `PORT` - Application port

## Volumes

- `postgres_data` - PostgreSQL data persistence across container restarts

## Networks

- `task-network` - Bridge network connecting app and db containers for internal communication

## Troubleshooting

### Database Connection Failed
1. Ensure PostgreSQL container is healthy: `docker-compose ps`
2. Check logs: `docker-compose logs db`
3. Verify DATABASE_URL in `.env`

### Port Already in Use
Change ports in `docker-compose.yml`:
\`\`\`yaml
ports:
  - "3001:3000"  # External:Internal
  - "3002:3001"
\`\`\`

### Rebuild Everything
\`\`\`bash
docker-compose down -v
docker-compose up -d --build
\`\`\`

## Production Deployment

For production, consider:
1. Using environment-specific compose files (docker-compose.prod.yml)
2. Setting secure database passwords
3. Using Docker secrets for sensitive data
4. Implementing proper logging and monitoring
5. Using a container registry (Docker Hub, GitHub Container Registry, etc.)
