import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { imagesRouter } from '@/api/images/imagesRouter';
import { env } from '@/common/utils/envConfig';
import { commentsRouter } from './api/comments/commentsRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/images', imagesRouter);
app.use('/comments', commentsRouter);

// Swagger UI
app.use(openAPIRouter);

export { app, logger };
