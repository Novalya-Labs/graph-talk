import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import queryRoutes from './routes/query.routes';
import { AppDataSource } from './configs/database';
import { Env } from './configs/env';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/health', (_, res) => {
  res.status(200).json({ message: 'OK' });
});

app.use('/query', queryRoutes);

const PORT = Env.PORT;
app.listen(PORT, () => {
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connected');
    })
    .catch((error) => {
      console.error('Database connection error:', error);
    });

  console.log(`Server running on http://localhost:${PORT}`);
});
