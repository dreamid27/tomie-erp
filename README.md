# Tomie ERP

A full-stack ERP application built with NestJS (backend) and React + Vite (frontend), using PostgreSQL as the database.

## 📁 Folder Structure

```
tomie-erp/
├── backend/                    # NestJS API server
│   ├── src/                   # Source code
│   │   ├── auth/             # Authentication module
│   │   ├── customer/         # Customer management
│   │   ├── product/          # Product management
│   │   ├── quotation/        # Quotation management
│   │   ├── sales-order/      # Sales order management
│   │   ├── user/             # User management
│   │   ├── app.module.ts     # Main application module
│   │   ├── main.ts           # Application entry point
│   │   └── prisma.service.ts # Prisma database service
│   ├── prisma/               # Database schema and migrations
│   │   ├── migrations/       # Database migration files
│   │   ├── schema.prisma     # Prisma schema definition
│   │   └── seed.ts           # Database seeding script
│   ├── test/                 # Test files
│   ├── Dockerfile            # Docker configuration for backend
│   ├── docker-compose.yml    # Backend + DB docker compose
│   └── package.json          # Backend dependencies
├── frontend/                  # React + Vite frontend
│   ├── src/                  # Source code
│   ├── public/               # Static assets
│   ├── Dockerfile            # Docker configuration for frontend
│   ├── docker-compose.yml    # Frontend docker compose
│   ├── vite.config.ts        # Vite configuration
│   └── package.json          # Frontend dependencies
├── postgres/                 # PostgreSQL data directory
├── docs/                     # Documentation
├── docker-compose.yml        # Main docker compose (DB only)
└── README.md                 # This file
```

## 🚀 Development Mode

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v13 or higher)

### 1. Database Setup

First, start the PostgreSQL database:

```bash
# Start PostgreSQL using Docker
docker-compose up -d db

# Or if you have PostgreSQL installed locally, make sure it's running
# with the following configuration:
# - Host: localhost
# - Port: 5432
# - Database: postgres
# - Username: postgres
# - Password: postgres
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables (create .env file if needed)
copy .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed the database with initial data
npx prisma db seed

# Start the backend in development mode
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the frontend in development mode
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. API Documentation

Once the backend is running, you can access the Swagger API documentation at:
`http://localhost:3000/api`

## 🐳 Docker Compose (Production)

### Running the Full Stack

To run both backend and frontend with Docker Compose:

```bash
# Build and start all services
docker-compose -f backend/docker-compose.yml up -d
docker-compose -f frontend/docker-compose.yml up -d

# Or run them separately:

# 1. Start database and backend
cd backend
docker-compose up -d

# 2. Start frontend (in another terminal)
cd frontend
docker-compose up -d
```

### Service URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api
- **Database**: localhost:5432

### Stopping Services

```bash
# Stop backend services
cd backend
docker-compose down

# Stop frontend services
cd frontend
docker-compose down

# Or stop all containers
docker stop $(docker ps -q)
```

## 🛠️ Available Scripts

### Backend Scripts

```bash
npm run start          # Start production server
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start development server with debugging
npm run build          # Build for production
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Frontend Scripts

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

### Database Scripts

```bash
# Run from backend directory
npx prisma migrate dev     # Create and apply new migration
npx prisma migrate deploy  # Apply migrations to database
npx prisma generate        # Generate Prisma client
npx prisma db seed         # Seed database with initial data
npx prisma studio          # Open Prisma Studio (database GUI)
```

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

### Frontend

Environment variables can be set in `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## 📝 Development Notes

- The backend uses NestJS with TypeScript
- The frontend uses React with TypeScript and Vite
- Database ORM: Prisma
- Authentication: JWT tokens
- UI Components: Radix UI with Tailwind CSS
- The application supports role-based access control (sales/customer roles)

## 🐛 Troubleshooting

### Database Connection Issues

1. Make sure PostgreSQL is running
2. Check if the DATABASE_URL is correct
3. Verify database credentials

### Port Conflicts

- Backend default port: 3000
- Frontend default port: 5173
- Database default port: 5432

Change ports in the respective configuration files if needed.

### Docker Issues

```bash
# Clean up Docker containers and images
docker-compose down --volumes --remove-orphans
docker system prune -a

# Rebuild containers
docker-compose build --no-cache
```
