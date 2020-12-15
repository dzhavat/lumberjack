import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';
import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';
import { LumberjackConsoleDriverOptions } from './lumberjack-console-driver.options';

@NgModule()
export class LumberjackConsoleDriverModule {
  /**
   * Pass a full Console driver configuration
   */
  static forRoot(config: LumberjackLogDriverConfig): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers: [{ provide: lumberjackConsoleDriverConfigToken, useValue: config }],
    };
  }

  /**
   * Pass options exclusive to the Console driver configuration, but fall back on
   * the log driver config for common options.
   */
  static withOptions(options: LumberjackConsoleDriverOptions): ModuleWithProviders<LumberjackConsoleDriverRootModule> {
    return {
      ngModule: LumberjackConsoleDriverRootModule,
      providers: [
        {
          provide: lumberjackConsoleDriverConfigToken,
          useValue: options,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import LumberjackConsoleDriverModule directly. Use LumberjackConsoleDriverModule.forRoot.');
  }
}
