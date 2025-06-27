const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db/connection');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');

// Import models
const User = require('./models/User');

const app = express();
const PORT = config.port;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// GET /api/users - List all users (updated to use MongoDB)
app.get('/api/users', async (req, res) => {
  try {
    // Optional query parameters for filtering
    const { name, email, minAge, maxAge } = req.query;
    let filter = {};

    // Filter by name (case-insensitive)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    // Filter by email (case-insensitive)
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    // Filter by age range
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }

    const users = await User.find(filter).select('-password');

    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get a specific user (updated to use MongoDB)
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete a user (updated to use MongoDB)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId).select('-password');

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: deletedUser
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// POST /api/users - Create a new user (updated to use MongoDB with password)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    // Basic validation
    if (!name || !email || !password || !age) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and age are required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      age: parseInt(age)
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser.toJSON()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: 'MongoDB connected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`List users: http://localhost:${PORT}/api/users`);
  console.log(`Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`Profile: GET http://localhost:${PORT}/api/auth/profile`);
});

module.exports = app; 