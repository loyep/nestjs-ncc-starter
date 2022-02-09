import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { url, method, params = {}, query = {} } = req;

    this.logger.log(
      `Before: ${method} ${url} with : params: ${JSON.stringify(
        params,
      )}, with query: ${JSON.stringify(query)}`,
    );
    const now = Date.now();
    res.on('close', () => {
      this.logger.log(`After: ${method} ${url} took ${Date.now() - now}ms`);
    });
    next();
  }
}
