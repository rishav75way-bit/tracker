# Expense Tracker Backend

A production-quality MERN stack backend built with TypeScript, featuring clean architecture, strict type safety, and industry-standard practices.

## Features

 **TypeScript with Strict Mode** - Full type safety with no `any` types  
 **Feature-Based Architecture** - Clean, organized folder structure  
 **Zod Validation** - Runtime type checking and validation  
 **bcrypt Password Hashing** - Secure password storage  
 **JWT Authentication** - Token-based authentication  
 **Protected Routes** - Auth middleware for secure endpoints  
 **Centralized Error Handling** - Consistent error responses  
 **MongoDB + Mongoose** - Robust database with proper indexing  
 **Environment Validation** - Type-safe environment variables  

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Zod
- **Authentication**: JWT + bcrypt
- **Dev Tools**: ts-node-dev

## Project Structure

```
backend/
 src/
    config/
       database.ts       # MongoDB connection
       env.ts            # Environment validation
    features/
       auth/
          controllers/  # Thin controllers
          models/       # User model
          schemas/      # Zod validation schemas
          services/     # Business logic
          routes.ts     # Auth routes
       expenses/
           controllers/  # Thin controllers
           models/       # Expense model
           schemas/      # Zod validation schemas
           services/     # Business logic
           routes.ts     # Expense routes
    middleware/
       authMiddleware.ts # JWT verification
       errorHandler.ts   # Centralized error handling
    types/
       index.ts          # TypeScript types
    utils/
       asyncHandler.ts   # Async wrapper
       constants.ts      # App constants
    routes.ts             # Centralized router
    index.ts              # App entry point
 .env                      # Environment variables
 .env.example              # Environment template
 tsconfig.json             # TypeScript config
 package.json              # Dependencies

```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB Atlas

**IMPORTANT**: You need to whitelist your IP address in MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster (Cluster0)
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Either:
   - Click "Add Current IP Address" to whitelist your current IP
   - Or click "Allow Access from Anywhere" (0.0.0.0/0) for testing

### 3. Environment Variables

The `.env` file is already configured with your MongoDB Atlas connection:

```env
PORT=5000
MONGODB_URI=mongodb+srv://rishavkamboj75_db_user:3eAbdwcAiByPom51@cluster0.8kr2zcx.mongodb.net/expense-tracker
JWT_SECRET=dev-secret-key-please-change-in-production-12345
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

** Security Note**: Change the `JWT_SECRET` before deploying to production!

### 4. Run the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```bash
GET /health
```

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Expenses (Protected - Requires Authentication)

All expense endpoints require the `Authorization: Bearer <token>` header.

#### Create Expense
```bash
POST /api/expenses
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "amount": 50.99,
  "category": "Food",
  "date": "2026-02-06T10:00:00.000Z",
  "note": "Lunch at restaurant"
}
```

#### Get All Expenses
```bash
GET /api/expenses
Authorization: Bearer <your-token>

# With filters:
GET /api/expenses?category=Food
GET /api/expenses?startDate=2026-02-01T00:00:00.000Z&endDate=2026-02-28T23:59:59.000Z
```

#### Get Expense by ID
```bash
GET /api/expenses/:id
Authorization: Bearer <your-token>
```

#### Update Expense
```bash
PUT /api/expenses/:id
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "amount": 45.50,
  "note": "Updated note"
}
```

#### Delete Expense
```bash
DELETE /api/expenses/:id
Authorization: Bearer <your-token>
```

#### Get Summary
```bash
GET /api/expenses/summary
Authorization: Bearer <your-token>

# With filters:
GET /api/expenses/summary?category=Food
GET /api/expenses/summary?startDate=2026-02-01T00:00:00.000Z
```

## Available Categories

- Food
- Travel
- Rent
- Shopping
- Other

## Testing

See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) for detailed testing instructions with curl examples.

## Architecture Highlights

### Clean Code Principles

- **No `any` types** - Strict TypeScript throughout
- **Thin controllers** - Only handle request/response
- **Business logic in services** - Proper separation of concerns
- **No DB queries in loops** - Efficient data access
- **Centralized constants** - DRY principle
- **Proper error handling** - Consistent error responses

### Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with configurable expiration
- Protected routes with auth middleware
- Input validation on all endpoints
- Proper HTTP status codes

### Database

- Mongoose schemas with validation
- Proper indexes for performance
- Clean data models
- No N+1 query problems

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

## Success Responses

All successful responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

## Development Notes

- The server uses `ts-node-dev` for hot reloading during development
- TypeScript is configured with strict mode enabled
- All routes are prefixed with `/api`
- CORS is enabled for frontend integration

## Next Steps

1. **Whitelist your IP** in MongoDB Atlas Network Access
2. **Test all endpoints** using the API Testing Guide
3. **Build the frontend** - React + TypeScript + Vite application

## License

ISC
