import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { corsOptions, helmetOptions, generalRateLimit, securityHeaders, requestLogger } from '@/middleware/security';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import routes from '@/routes';
import logger from '@/utils/logger';
import database from '@/utils/database';

export class Server {
  public app: express.Application;
  private port: number;

  constructor(port: number = 3001) {
    this.app = express();
    this.port = port;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet(helmetOptions));
    this.app.use(cors(corsOptions));
    this.app.use(generalRateLimit);
    this.app.use(securityHeaders);

    // Request parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser(process.env.COOKIE_SECRET));

    // Logging middleware
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(pinoHttp({ logger }));
      this.app.use(requestLogger);
    }

    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/v1', routes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'PayFlow API Server',
        version: '1.0.0',
        documentation: '/api/v1/health',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await database.connect();

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`🚀 PayFlow API Server running on port ${this.port}`);
        logger.info(`📚 API Documentation: http://localhost:${this.port}/api/v1/health`);
        logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      await database.disconnect();
      logger.info('Server stopped gracefully');
    } catch (error) {
      logger.error('Error stopping server:', error);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}