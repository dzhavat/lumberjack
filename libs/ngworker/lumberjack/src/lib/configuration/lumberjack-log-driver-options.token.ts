import { InjectionToken } from '@angular/core';

import { LumberjackLogDriverOptions } from './lumberjack-log-driver.options';

export const lumberjackLogDriverOptionsToken: InjectionToken<LumberjackLogDriverOptions> = new InjectionToken(
  '__LUMBERJACK_LOG_DRIVER_OPTIONS__'
);
