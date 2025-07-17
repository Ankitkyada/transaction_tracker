require('dotenv').config();

const express = require('express');
const db = require('./config/db'); // Database connection
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api'); // API routes
const path = require('path'); // For serving static files and views
const cookieParser = require('cookie-parser');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use((req, res, next) => {
  req.db = db;
  next();
}); 
// Route setup  
app.use('/', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
