import { Injectable, VERSION } from '@angular/core';

import {
  LumberjackLogger,
  LumberjackLoggerFactoryArguments,
  LumberjackService,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { AppLog } from './app.log';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger<AppLog> {
  static logContext = 'Forest App';

  constructor(lumberjack: LumberjackService<AppLog>, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  forestOnFire = this.createCriticalLogger(
    this.createFactoryArguments({
      message: 'The forest is on fire',
    })
  );

  helloForest = this.createInfoLogger(
    this.createFactoryArguments({
      message: 'Hello, Forest!',
    })
  );

  private createFactoryArguments({
    message,
  }: Pick<LumberjackLoggerFactoryArguments<AppLog>, 'message'>): LumberjackLoggerFactoryArguments<AppLog> {
    return {
      context: AppLogger.logContext,
      customLog: {
        angularVersion: VERSION.full,
      },
      message,
    };
  }
}
