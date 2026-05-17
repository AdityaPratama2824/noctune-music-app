const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const {errorHandler, notFound} = require('../src/middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const musicRoutes = require('./routes/musicRoutes');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
const app = express();
app.use(cors(corsOptions));
connectDB();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.get('/', (req, res) => {
  res.send('Noctune Music App is running!');
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});