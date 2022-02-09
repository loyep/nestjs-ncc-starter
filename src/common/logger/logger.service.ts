import {
  Injectable,
  Scope,
  Logger as NestLogger,
  LoggerService as NestLoggerService,
  LogLevel,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private readonly logger: NestLogger = new NestLogger(LoggerService.name);

  log(message: any, ...optionalParams: any[]) {
    this.logger.log(message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }
  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    //
  }
}
