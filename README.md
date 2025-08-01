# Tomie ERP

A full-stack ERP application built with NestJS (backend) and React + Vite (frontend), using PostgreSQL as the database.

for login, you can use the following credentials:

- username: sales1 (password: sales123)
- username: sales2 (password: sales123)
- username: customer1 (password: customer123)
- username: customer2 (password: customer123)

[Download or watch the demo](demo.mp4)

![Screenshot](image1.png)
![Screenshot](image2.png)
![Screenshot](image3.png)
![Screenshot](image4.png)

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

## 🐳 Docker Compose (Production)

### Running the Full Stack

To run both backend and frontend with Docker Compose:

```bash
# Build and start all services
docker-compose -f backend/docker-compose.yml up -d --build
docker-compose -f frontend/docker-compose.yml up -d --build

# Or run them separately:

# 1. Start database and backend
cd backend
docker-compose up -d --build

# 2. Start frontend (in another terminal)
cd frontend
docker-compose up -d --build
```

After running the above commands, the application should be accessible at `http://localhost:3000` for backend and `http://localhost:5173` for frontend.

you can also access the API documentation at `http://localhost:3000/api`

for login, you can use the following credentials:

- username: sales1 (password: sales123)
- username: sales2 (password: sales123)
- username: customer1 (password: customer123)
- username: customer2 (password: customer123)

## 🚀 Development Mode

### Prerequisites

- Node.js (v24 or higher)
- Docker or Orbstack for running docker containers
- npm or yarn
- PostgreSQL (v13 or higher)

### 1. Database Setup

First, start the PostgreSQL database:

```bash
# Start PostgreSQL using Docker
docker-compose -f backend/docker-compose.yml up -d db

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

# Set up environment variables (create .env file if needed)
copy .env.example .env

# Install dependencies
npm install

# Start the frontend in development mode
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. API Documentation

Once the backend is running, you can access the Swagger API documentation at:
`http://localhost:3000/api`

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

## 📝 Development Notes

- The backend uses NestJS with TypeScript
- The frontend uses React with TypeScript and Vite
- Database ORM: Prisma
- Authentication: JWT tokens
- UI Components: Radix UI with Tailwind CSS
- The application supports role-based access control (sales/customer roles)
