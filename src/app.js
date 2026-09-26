import express from 'express';
import cors from 'cors';
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

app.use(errorHandler);

export default app;
