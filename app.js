const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

app.use(errorHandler); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});