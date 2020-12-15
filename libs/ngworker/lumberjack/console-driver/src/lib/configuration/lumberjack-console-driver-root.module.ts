import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import {
  LumberjackLogDriverOptions,
  lumberjackLogDriverOptionsToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { LumberjackConsole } from '../console/lumberjack-console';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';
import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverConfig } from './lumberjack-console-driver.config';

export function consoleDriverFactory(
  logDriverOptions: LumberjackLogDriverOptions,
  consoleDriverConfig: LumberjackConsoleDriverConfig,
  console: LumberjackConsole
): LumberjackConsoleDriver {
  const config: LumberjackConsoleDriverConfig = {
    ...logDriverOptions,
    ...consoleDriverConfig,
  };

  return new LumberjackConsoleDriver(config, console);
}

@NgModule({
  providers: [
    {
      deps: [lumberjackLogDriverOptionsToken, lumberjackConsoleDriverConfigToken, lumberjackConsoleToken],
      multi: true,
      provide: lumberjackLogDriverToken,
      useFactory: consoleDriverFactory,
    },
  ],
})
export class LumberjackConsoleDriverRootModule {
  constructor(
    // tslint:disable: no-any no-null-keyword
    @Optional()
    @SkipSelf()
    @Inject(LumberjackConsoleDriverRootModule)
    maybeNgModuleFromParentInjector: LumberjackConsoleDriverRootModule = null as any
    // tslint:enable: no-any no-null-keyword
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
