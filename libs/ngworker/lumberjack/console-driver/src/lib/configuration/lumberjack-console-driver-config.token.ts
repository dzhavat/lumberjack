import { InjectionToken } from '@angular/core';

import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

export const lumberjackConsoleDriverConfigToken = new InjectionToken<LumberjackConsoleDriverConfig>(
  '__LUMBERJACK_CONSOLE_DRIVER_CONFIG__'
);
