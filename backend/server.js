require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/employees', require('./routes/employeeRoutes.js'));
app.use('/api/ai', require('./routes/aiRoutes.js'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
