import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import profileRoutes from './routes/profileRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

app.use(limiter);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitHub Profile Analyzer API',
      version: '1.0.0',
      description: 'Analyze GitHub profiles and store insights in MySQL.',
    },
    servers: [
      {
        url: '/api/v1',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GitHub Profile Analyzer API is running 🚀',
    docs: '/api/v1/docs',
    health: '/api/v1/health'
  });
});

app.use('/api/v1', profileRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
