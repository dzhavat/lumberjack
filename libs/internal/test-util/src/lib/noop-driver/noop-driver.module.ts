import { ModuleWithProviders, NgModule } from '@angular/core';

import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { defaultNoopDriverConfig } from './default-noop-driver.config';
import { noopDriverConfigToken } from './noop-driver-config.token';
import { NoopDriverRootModule } from './noop-driver-root.module';

/**
 * Service module for `NoopDriver`.
 *
 * Use `NoopDriverModule.forRoot` to import.
 */
@NgModule()
export class NoopDriverModule {
  /**
   * Pass a full Console driver configuration
   */
  static forRoot(
    config: LumberjackLogDriverConfig = defaultNoopDriverConfig
  ): ModuleWithProviders<NoopDriverRootModule> {
    return {
      ngModule: NoopDriverRootModule,
      providers: [{ provide: noopDriverConfigToken, useValue: config }],
    };
  }

  constructor() {
    throw new Error('Do not import NoopDriverModule directly. Use NoopDriverModule.forRoot.');
  }
}
