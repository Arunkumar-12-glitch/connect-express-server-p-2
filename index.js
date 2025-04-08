require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./schema'); // Import user schema

const app = express();
const port = process.env.PORT || 3010;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static('static'));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  });

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'pages/index.html'));
});

// POST API to create a user
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body); // Create a new user instance
    const savedUser = await newUser.save(); // Save user to the database
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
