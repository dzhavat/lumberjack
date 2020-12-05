import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';

import { LumberjackLevel, LumberjackLogDriver, LumberjackLogDriverLog, LumberjackLogLevel } from '@ngworker/lumberjack';

import { lumberjackHttpDriverConfigToken } from '../configuration/lumberjack-http-driver-config.token';
import { LumberjackHttpDriverConfig } from '../configuration/lumberjack-http-driver.config';
import { LumberjackHttpLog } from '../logs/lumberjack-http.log';
import { retryWithDelay } from '../operators/retry-with-delay.operator';

@Injectable()
export class LumberjackHttpDriver implements LumberjackLogDriver {
  constructor(
    private http: HttpClient,
    @Inject(lumberjackHttpDriverConfigToken) public config: LumberjackHttpDriverConfig,
    private ngZone: NgZone
  ) {}

  logCritical({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLevel.Critical);
  }

  logDebug({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLevel.Debug);
  }

  logError({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLevel.Error);
  }

  logInfo({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLevel.Info);
  }

  logTrace({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLevel.Trace);
  }

  logWarning({ formattedLog }: LumberjackLogDriverLog): void {
    this.sendLog(formattedLog, LumberjackLevel.Warning);
  }

  private sendLog(formattedLog: string, logLevel: LumberjackLogLevel): void {
    const { origin, retryOptions, storeUrl } = this.config;
    const httpLog: LumberjackHttpLog = { formattedLog, level: logLevel, origin };

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, httpLog)
        .pipe(retryWithDelay(retryOptions.maxRetries, retryOptions.delayMs))
        .subscribe();
    });
  }
}
