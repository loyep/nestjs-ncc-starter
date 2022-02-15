import {
  Injectable,
  Scope,
  LoggerService as NestLoggerService,
  Optional,
} from '@nestjs/common';
import { Logger } from 'winston';

import DailyRotateFile = require('winston-daily-rotate-file');
import {
  createLogger,
  format,
  level as WinstonLogLevel,
  transports,
} from 'winston';
export const isString = (val: any): val is string => typeof val === 'string';

type LogLevel = "log" | "error" | "warn" | "verbose" | "debug"

const { combine, timestamp, colorize, splat, prettyPrint, ms, printf } = format;

const loggerFormat = [
  timestamp({ format: 'YYYY-MM-DD A HH:mm:ss.SSS' }),
  prettyPrint(),
  ms(),
  printf((info) => {
    if (info.stack) {
      info.message = info.stack;
    }
    return `[${process.pid}]${info.timestamp} ${info.level} [${
      info.context || 'Application'
    }] ${info.ms} ${info.message}`;
    // [Nest] 58402  - 2022/02/11 下午3:40:43     LOG [NestFactory] Starting Nest application...
  }),
];

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
      const name = 'nestjs';
      LoggerService.staticInstanceRef = createLogger({
        exitOnError: false,
        defaultMeta: { pid: process.pid },
        transports: [
          new transports.Console({
            format: combine(
              colorize({
                all: true,
              }),
              ...loggerFormat,
            ),
          }),
          new DailyRotateFile({
            filename: `${name}-%DATE%.log`,
            dirname: 'storages/logs',
            datePattern: 'YYYYMMDD-HH',
            zippedArchive: true,
            handleExceptions: true,
            maxSize: '20m',
            json: false,
            maxFiles: '14d',
            format: combine(...loggerFormat),
          }),
        ],
      });
    }
    return LoggerService.staticInstanceRef;
  }

  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: [...any, string?]): void;
  log(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, 'info');
  }

  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: [...any, string?, string?]): void;
  error(message: any, ...optionalParams: any[]) {
    const { messages, context, stack } =
      this.getContextAndStackAndMessagesToPrint([message, ...optionalParams]);
    this.printMessages(messages, context, 'error');
    this.loggerInstance.log('error', message as string, { context, stack });
  }

  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: [...any, string?]): void;
  warn(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, 'warn');
  }

  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: [...any, string?]): void;
  debug(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, 'debug');
  }

  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: [...any, string?]): void;
  verbose(message: any, ...optionalParams: any[]) {
    const { messages, context } = this.getContextAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);
    this.printMessages(messages, context, 'verbose');
  }

  setLogLevels?(levels: (LogLevel)[]) {
    // this.loggerInstance.configure({
    // levels: levels as WinstonLogLevel[]
    // });
  }

  private getContextAndMessagesToPrint(args: unknown[]) {
    if (args?.length <= 1) {
      return { messages: args, context: this.context };
    }
    const lastElement = args[args.length - 1];
    const isContext = isString(lastElement);
    if (!isContext) {
      return { messages: args, context: this.context };
    }
    return {
      context: lastElement as string,
      messages: args.slice(0, args.length - 1),
    };
  }

  private getContextAndStackAndMessagesToPrint(args: unknown[]) {
    const { messages, context } = this.getContextAndMessagesToPrint(args);
    if (messages?.length <= 1) {
      return { messages, context };
    }
    const lastElement = messages[messages.length - 1];
    const isStack = isString(lastElement);
    if (isStack) {
      return { messages, context };
    }
    return {
      stack: lastElement as string,
      messages: messages.slice(0, messages.length - 1),
      context,
    };
  }

  protected printMessages(
    messages: unknown[],
    context = '',
    logLevel: string = 'info',
  ) {
    messages.forEach((message) => {
      this.loggerInstance.log(logLevel as any, message as string, { context });
    });
  }
}
