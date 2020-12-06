import { Inject, Injectable, Optional } from '@angular/core';

import { LumberjackRootModule } from '../configuration/lumberjack-root.module';
import { formatLogDriverError } from '../formatting/format-log-driver-error';
import { LumberjackLogFormatter } from '../formatting/lumberjack-log-formatter.service';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { LumberjackLogDriverLog } from '../log-drivers/lumberjack-log-driver.log';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

// tslint:disable-next-line: no-any
export type CustomLog = Record<string, any>;

/**
 * Service responsible to add logs to the applications.
 *
 * It's API provides a single `log` method, which will load all `log-drivers`
 * provided through the application.
 *
 *
 */
@Injectable({ providedIn: LumberjackRootModule })
// tslint:disable-next-line: no-any
export class LumberjackService<TCustomLog extends Record<string, any> | undefined = undefined> {
  private drivers: LumberjackLogDriver[];

  constructor(
    @Optional() @Inject(lumberjackLogDriverToken) drivers: LumberjackLogDriver[],
    private logFormatter: LumberjackLogFormatter,
    private time: LumberjackTimeService
  ) {
    drivers = drivers || [];
    this.drivers = Array.isArray(drivers) ? drivers : [drivers];
  }

  log(lumberjackLog: LumberjackLog, customLog: TCustomLog): void {
    const { log, formattedLog } = this.logFormatter.formatLog(lumberjackLog);

    this.logWithHandleErrors(log, formattedLog, this.drivers);
  }

  private canDriveLog(driver: LumberjackLogDriver, logLevel: LumberjackLogLevel): boolean {
    const {
      config: { levels: driverConfigLevels },
    } = driver;

    const isVerboseDriver = driverConfigLevels.length === 1 && driverConfigLevels[0] === LumberjackLevel.Verbose;
    const isLogLevelEnabled = (driverConfigLevels as LumberjackLogLevel[]).includes(logLevel);

    return isVerboseDriver || isLogLevelEnabled;
  }

  private createDriverErrorLog(driverError: LumberjackLogDriverError): LumberjackLog {
    return {
      context: 'LumberjackLogDriverError',
      createdAt: this.time.getUnixEpochTicks(),
      level: LumberjackLevel.Error,
      message: formatLogDriverError(driverError),
    };
  }

  private logDriverError(driverError: LumberjackLogDriverError): void {
    const errorMessage = formatLogDriverError(driverError);

    console.error(errorMessage);
  }

  private driveLog(driver: LumberjackLogDriver, driverLog: LumberjackLogDriverLog): void {
    switch (driverLog.log.level) {
      case LumberjackLevel.Critical:
        driver.logCritical(driverLog);

        break;
      case LumberjackLevel.Debug:
        driver.logDebug(driverLog);

        break;
      case LumberjackLevel.Error:
        driver.logError(driverLog);

        break;
      case LumberjackLevel.Info:
        driver.logInfo(driverLog);

        break;
      case LumberjackLevel.Trace:
        driver.logTrace(driverLog);

        break;
      case LumberjackLevel.Warning:
        driver.logWarning(driverLog);

        break;
    }
  }

  private logWithHandleErrors(
    log: LumberjackLog,
    formattedLog: string,
    drivers: LumberjackLogDriver[],
    driverErrors: LumberjackLogDriverError[] = [],
    errorIndex = -1
  ): void {
    const stableDrivers: LumberjackLogDriver[] = [];
    drivers.forEach((driver) => {
      if (this.canDriveLog(driver, log.level)) {
        try {
          this.driveLog(driver, { formattedLog, log });
          stableDrivers.push(driver);
          errorIndex = this.removeHandledError(errorIndex, driverErrors);
        } catch (error) {
          driverErrors = [...driverErrors, { error, logDriver: driver, formattedLog }];
        }
      }
    });
    this.processErrors(stableDrivers, driverErrors);
  }

  private logDriverErrorsToStableDrivers(
    driverErrors: LumberjackLogDriverError[],
    stableDrivers: LumberjackLogDriver[]
  ) {
    driverErrors.forEach((error, index) => {
      const driverErrorLog = this.createDriverErrorLog(error);

      this.logWithHandleErrors(driverErrorLog, driverErrorLog.message, stableDrivers, driverErrors, index);
    });
  }

  private outputUnhandledDriverErrors(driverErrors: ReadonlyArray<LumberjackLogDriverError>) {
    driverErrors.forEach((error) => this.logDriverError(error));
  }

  private processErrors(stableDrivers: LumberjackLogDriver[], driverErrors: LumberjackLogDriverError[]) {
    if (stableDrivers.length === 0) {
      this.outputUnhandledDriverErrors(driverErrors);
    } else {
      this.logDriverErrorsToStableDrivers(driverErrors, stableDrivers);
    }
  }

  private removeHandledError(errorIndex: number, errors: LumberjackLogDriverError[]) {
    if (errorIndex > -1) {
      errors.splice(errorIndex, 1);
      errorIndex = -1;
    }

    return errorIndex;
  }
}
