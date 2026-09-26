import express from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes.js';
import experimentRoutes from './experiments/experiment.routes.js';
import errorHandler from './errors/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CogniLab API Server is running cleanly',
    timestamp: new Date().toISOString()
  });
});

app.use('/auth', authRoutes);
app.use('/experiments', experimentRoutes);

app.use(errorHandler);

export default app;
