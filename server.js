import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';
import authRoutes from './routes/authRoutes.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(logger);

app.use('/api/url', urlRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));