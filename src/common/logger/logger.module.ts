import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from './logger.service';
const DEFAULT_ROUTES = [{ path: '*', method: RequestMethod.ALL }];

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export default class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(...DEFAULT_ROUTES);
  }
}
