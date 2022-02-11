import {
  Injectable,
  Scope,
  Logger as NestLogger,
  LoggerService as NestLoggerService,
  LogLevel,
  Optional,
} from '@nestjs/common';
import type { Logger } from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { createLogger, format, transports } from 'winston';

const {
  combine,
  timestamp,
  label,
  prettyPrint,
  metadata,
  ms,
  json,
  colorize,
  splat,
} = format;

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  protected static staticInstanceRef?: Logger;

  constructor();
  constructor(context: string);
  constructor(context: string, options?: { timestamp?: boolean });
  constructor(
    @Optional() protected context?: string,
    @Optional() protected options: { timestamp?: boolean } = {},
  ) {}

  get loggerInstance(): Logger {
    if (!LoggerService.staticInstanceRef) {
      const name = 'aorajs';
      LoggerService.staticInstanceRef = createLogger({
        exitOnError: false,
        format: combine(
          colorize({
            colors: {
              error: 'red',
              info: 'green',
              warn: 'yellow',
              debug: 'green',
              verbose: 'red',
            },
          }),
          splat(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.printf((info) => {
            if (info.stack) {
              info.message = info.stack;
            }
            return `${info.timestamp} [${process.pid}] ${info.level}: [${
              info.context || 'Application'
            }] ${info.message}`;
          }),
        ),
        defaultMeta: { pid: process.pid },
        transports: [
          new transports.Console(),
          new DailyRotateFile({
            filename: `${name}-%DATE%.log`,
            dirname: 'storages/logs',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            handleExceptions: true,
            maxSize: '20m',
            json: false,
            maxFiles: '14d',
          }),
        ],
      });
    }
    return LoggerService.staticInstanceRef;
  }

  log(message: any, ...optionalParams: any[]) {
    this.loggerInstance.log('info', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.loggerInstance.error(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.loggerInstance.warn(message, ...optionalParams);
  }
  debug(message: any, ...optionalParams: any[]) {
    this.loggerInstance.debug(message, ...optionalParams);
  }
  verbose(message: any, ...optionalParams: any[]) {
    this.loggerInstance.verbose(message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    //
  }
}
