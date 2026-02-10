import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { healthRouter } from './routes/health';
import { errorHandler } from './middleware/error';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp());

  app.use('/health', healthRouter);

  app.use(errorHandler);

  return app;
}
