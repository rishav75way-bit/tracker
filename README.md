# Expense Tracker

A full-stack MERN expense tracking application with TypeScript, featuring real-time expense management, budget tracking, and data visualization.

## Features

- User authentication with JWT
- Expense CRUD operations
- Budget management and tracking
- Category-based expense filtering
- Monthly spending trends
- Interactive charts and visualizations
- Responsive design

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- TypeScript
- Zod validation
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React 18 + TypeScript
- Vite
- React Router v6
- React Hook Form + Zod
- Recharts for data visualization
- Tailwind CSS
- Axios

## Project Structure

```
Tracker/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── common/
│   │   │   └── features/
│   │   ├── config/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── features/
    │   └── shared/
    ├── package.json
    └── vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and connect to the backend at `http://localhost:5000`.

## Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary` - Get expense summary
- `GET /api/expenses/stats/categories` - Get category statistics
- `GET /api/expenses/stats/monthly` - Get monthly statistics

### Budget
- `POST /api/expenses/budget` - Set monthly budget
- `GET /api/expenses/budget` - Get budget for month

## Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - JWT expiration time
- `NODE_ENV` - Environment (development/production)

