# Daily Collections SaaS Platform

A complete, production-ready SaaS platform for managing daily loan collections with multi-tenant support, JWT authentication, and modern UI.

## Tech Stack

- **Backend**: Spring Boot 3.2.0 (Java 21) + PostgreSQL 16
- **Frontend**: Angular 18 + Tailwind CSS
- **Infrastructure**: Docker + Docker Compose

## Quick Start

### 1. Install Frontend Dependencies

```bash
cd from
npm install
cd ..
```

### 2. Start the Platform

```bash
docker-compose up --build
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api

## First-Time Setup

### Register a User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Login

Navigate to http://localhost and use:

- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Loans

- `GET /api/loans` - Get all loans for authenticated user
- `POST /api/loans` - Create new loan
- `POST /api/loans/pay` - Register payment

### Dashboard

- `GET /api/dashboard/summary` - Get daily summary statistics

## Architecture

### Backend

- **Security**: JWT-based authentication with Spring Security
- **Data Isolation**: Multi-tenant architecture with user-based filtering
- **Business Logic**: 20% interest calculation, automatic balance updates
- **Error Handling**: Global exception handler with consistent JSON responses

### Frontend

- **Routing**: Protected routes with auth guard
- **State Management**: Service-based with RxJS
- **Styling**: Tailwind CSS with dark mode support
- **API Communication**: HTTP interceptor for automatic token injection

### DevOps

- **Containerization**: Multi-stage Docker builds
- **Networking**: Internal Docker network for service communication
- **Persistence**: PostgreSQL volume for data persistence
- **Reverse Proxy**: Nginx for SPA routing and API proxying

## Project Structure

```
AppCobranza/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/AppCobranza/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── model/          # JPA entities
│   │   ├── dto/            # Data transfer objects
│   │   ├── security/       # JWT & security config
│   │   └── exception/      # Global exception handling
│   ├── Dockerfile
│   └── pom.xml
├── from/                    # Angular frontend
│   ├── src/app/
│   │   ├── core/           # Services, models, interceptors
│   │   ├── features/       # Feature modules (auth, dashboard)
│   │   └── layout/         # Layout components
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml       # Orchestration
```

## Key Features

✅ **Multi-Tenant Support** - Complete data isolation by user  
✅ **JWT Authentication** - Secure, stateless authentication  
✅ **Automatic Calculations** - 20% interest, daily fees, balance tracking  
✅ **Payment Validation** - Business logic prevents overpayment  
✅ **Modern UI** - Responsive design with Tailwind CSS  
✅ **Docker Ready** - One-command deployment  
✅ **RESTful API** - Clean, documented endpoints  
✅ **Global Error Handling** - Consistent error responses

## Development

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Development

```bash
cd from
npm start
```

## License

This project is provided as-is for educational and commercial use.
