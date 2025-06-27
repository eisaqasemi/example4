# User Management API with MongoDB Authentication

A Node.js Express API for managing users with MongoDB integration, password hashing, and JWT authentication.

## Features

- **MongoDB Integration**: Persistent data storage with Mongoose ODM
- **User Authentication**: Login and registration with JWT tokens
- **Password Security**: Bcrypt password hashing
- **User Management**: CRUD operations for users
- **Input Validation**: Comprehensive validation for all endpoints
- **Error Handling**: Proper error responses and logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/user-management-api
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

4. Start MongoDB:
Make sure MongoDB is running on your system or use MongoDB Atlas.

5. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
}
```

### User Management Endpoints

#### GET /api/users
List all users with optional filtering.

**Query Parameters:**
- `name`: Filter by name (case-insensitive)
- `email`: Filter by email (case-insensitive)
- `minAge`: Minimum age filter
- `maxAge`: Maximum age filter

**Example:**
```
GET /api/users?name=john&minAge=25
```

#### GET /api/users/:id
Get a specific user by ID.

#### POST /api/users
Create a new user (includes password).

#### DELETE /api/users/:id
Delete a user by ID.

### Health Check

#### GET /health
Check server status.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

2. The token is automatically generated when you register or login.

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid credentials or missing token)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with a cost factor of 12
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing configuration

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, min 6 characters),
  age: Number (required, 1-120),
  createdAt: Date (auto-generated)
}
```

## Testing the API

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

### Example cURL commands:

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 30
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get profile (with token):**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your-token>"
```

## Project Structure

```
├── server.js              # Main server file
├── config.js              # Configuration settings
├── package.json           # Dependencies and scripts
├── models/
│   └── User.js           # User model with password hashing
├── controllers/
│   └── authController.js  # Authentication logic
├── routes/
│   └── auth.js           # Authentication routes
├── middleware/
│   └── auth.js           # JWT authentication middleware
└── db/
    └── connection.js     # MongoDB connection
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/user-management-api` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key-change-this-in-production` |
| `PORT` | Server port | `3000` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License 