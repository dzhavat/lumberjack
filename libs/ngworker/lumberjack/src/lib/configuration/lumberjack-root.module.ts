import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { lumberjackFormatLog } from '../formatting/lumberjack-format-log';

import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverOptionsToken } from './lumberjack-log-driver-options.token';
import { LumberjackLogDriverOptions } from './lumberjack-log-driver.options';
import { lumberjackOptionsToken } from './lumberjack-options.token';
import { LumberjackConfig } from './lumberjack.config';
import { LumberjackOptions } from './lumberjack.options';

export function configFactory(options: LumberjackOptions = {}, isProductionEnvironment: boolean): LumberjackConfig {
  return {
    format: lumberjackFormatLog,
    levels: isProductionEnvironment ? defaultProductionLevels : defaultDevelopmentLevels,
    ...options,
  };
}

export function logDriverConfigFactory({ levels }: LumberjackConfig): LumberjackLogDriverOptions {
  return {
    levels,
  };
}

@NgModule({
  providers: [
    {
      deps: [lumberjackOptionsToken, isProductionEnvironmentToken],
      provide: lumberjackConfigToken,
      useFactory: configFactory,
    },
    {
      deps: [lumberjackConfigToken],
      provide: lumberjackLogDriverOptionsToken,
      useFactory: logDriverConfigFactory,
    },
  ],
})
export class LumberjackRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    @Inject(LumberjackRootModule)
    maybeNgModuleFromParentInjector: LumberjackRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
