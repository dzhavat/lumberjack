import { Injectable } from '@angular/core';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLoggerFactoryArguments } from './lumberjack-logger-factory-arguments';
import { LumberjackService } from './lumberjack.service';

// tslint:disable-next-line: no-any
interface InternalLoggerFactoryArguments<TCustomLog extends Record<string, any> | undefined = undefined>
  extends LumberjackLoggerFactoryArguments<TCustomLog> {
  readonly logLevel: LumberjackLogLevel;
}

@Injectable()
// tslint:disable-next-line: no-any
export abstract class LumberjackLogger<TCustomLog extends Record<string, any> | undefined = undefined> {
  constructor(private lumberjack: LumberjackService<TCustomLog>, private time: LumberjackTimeService) {}

  protected createCriticalLogger(args: LumberjackLoggerFactoryArguments<TCustomLog>): () => void {
    return this.createLogger({
      ...args,
      logLevel: LumberjackLevel.Critical,
    });
  }

  protected createDebugLogger(args: LumberjackLoggerFactoryArguments<TCustomLog>): () => void {
    return this.createLogger({
      ...args,
      logLevel: LumberjackLevel.Debug,
    });
  }

  protected createErrorLogger(args: LumberjackLoggerFactoryArguments<TCustomLog>): () => void {
    return this.createLogger({
      ...args,
      logLevel: LumberjackLevel.Error,
    });
  }

  protected createInfoLogger(args: LumberjackLoggerFactoryArguments<TCustomLog>): () => void {
    return this.createLogger({
      ...args,
      logLevel: LumberjackLevel.Info,
    });
  }

  protected createTraceLogger(args: LumberjackLoggerFactoryArguments<TCustomLog>): () => void {
    return this.createLogger({
      ...args,
      logLevel: LumberjackLevel.Trace,
    });
  }

  protected createWarningLogger(args: LumberjackLoggerFactoryArguments<TCustomLog>): () => void {
    return this.createLogger({
      ...args,
      logLevel: LumberjackLevel.Warning,
    });
  }

  private createLogger({
    context = '',
    customLog,
    logLevel,
    message,
  }: InternalLoggerFactoryArguments<TCustomLog>): () => void {
    return () => {
      this.lumberjack.log({ context, createdAt: this.time.getUnixEpochTicks(), level: logLevel, message }, customLog);
    };
  }
}
