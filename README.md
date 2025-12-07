# 1. Navigate to the project folder
cd nodejs2025Q2-service

# 2. Install dependencies
npm install

# 3. Create environment configuration
cp .env.example .env

# 4. Generate Prisma client
npx prisma generate

# 5. Start PostgreSQL via Docker
docker compose up -d postgres

# 6. Apply database migrations
npx prisma migrate deploy

# 7. Start the application
npm start
