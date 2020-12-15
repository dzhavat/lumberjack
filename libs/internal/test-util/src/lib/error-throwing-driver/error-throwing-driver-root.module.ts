import { NgModule, Optional, SkipSelf } from '@angular/core';

import {
  LumberjackLogDriverOptions,
  lumberjackLogDriverOptionsToken,
  lumberjackLogDriverToken,
} from '@ngworker/lumberjack';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';
import { ErrorThrowingDriver } from './error-throwing.driver';

export function errorThrowingDriverFactory(
  logDriverOptions: LumberjackLogDriverOptions,
  errorThrowingDriverConfig: ErrorThrowingDriverConfig
): ErrorThrowingDriver {
  const config: ErrorThrowingDriverConfig = {
    ...logDriverOptions,
    ...errorThrowingDriverConfig,
  };

  return new ErrorThrowingDriver(config);
}

@NgModule({
  providers: [
    {
      deps: [lumberjackLogDriverOptionsToken, errorThrowingDriverConfigToken],
      provide: lumberjackLogDriverToken,
      useFactory: errorThrowingDriverFactory,
      multi: true,
    },
  ],
})
export class ErrorThrowingDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: ErrorThrowingDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ErrorThrowingDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
