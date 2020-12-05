import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuardedAgainstDirectImport, resolveDependency } from '@internal/test-util';
import {
  LumberjackConfigLevels,
  lumberjackConfigToken,
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverConfig,
  lumberjackLogDriverToken,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

import { LumberjackHttpDriverConfig } from './lumberjack-http-driver.config';
import { LumberjackHttpDriverModule } from './lumberjack-http-driver.module';
import { LumberjackHttpDriverOptions } from './lumberjack-http-driver.options';

function createHttpOptions(): LumberjackHttpDriverOptions {
  return {
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
    storeUrl: 'api/logstore',
  };
}

function createHttpConfig(levels: LumberjackConfigLevels): LumberjackHttpDriverConfig {
  return {
    levels,
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
    storeUrl: 'api/logstore',
  };
}

const createHttpDriver = (
  {
    config,
    isLumberjackModuleImportedFirst = true,
  }: {
    config: LumberjackHttpDriverConfig;
    isLumberjackModuleImportedFirst?: boolean;
  } = {
    config: createHttpConfig([LumberjackLevel.Verbose]),
  }
) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      LumberjackHttpDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];

  return httpDriver;
};
const createHttpDriverWithOptions = (
  {
    isLumberjackModuleImportedFirst = true,
    options,
  }: {
    isLumberjackModuleImportedFirst?: boolean;
    options: LumberjackHttpDriverOptions;
  } = { options: createHttpOptions() }
) => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      LumberjackHttpDriverModule.withOptions(options),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [httpDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];

  return httpDriver;
};

describe(LumberjackHttpDriverModule.name, () => {
  it(`cannot be imported without using the ${LumberjackHttpDriverModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuardedAgainstDirectImport(LumberjackHttpDriverModule);
  });

  describe(LumberjackHttpDriverModule.forRoot.name, () => {
    it('provides the HTTP driver', () => {
      const httpDriver = createHttpDriver();

      expect(httpDriver).toBeInstanceOf(LumberjackHttpDriver);
    });

    it('registers the specified log driver configuration', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Error]);

      const httpDriver = createHttpDriver({ config: expectedConfig });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('registers a default level configuration if none is specified', () => {
      const customHttpConfig = createHttpConfig([LumberjackLevel.Verbose]);

      const httpDriver = createHttpDriver({ config: customHttpConfig });

      const actualConfig = httpDriver.config;
      const logConfig = resolveDependency(lumberjackConfigToken);
      const defaultLogDriverConfig: LumberjackLogDriverConfig = {
        levels: logConfig.levels,
      };
      const expectedConfig: LumberjackHttpDriverConfig = { ...defaultLogDriverConfig, ...customHttpConfig };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const expectedConfig = createHttpConfig([LumberjackLevel.Debug]);

      const httpDriver = createHttpDriver({
        config: expectedConfig,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = httpDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });
  });

  describe(LumberjackHttpDriverModule.withOptions.name, () => {
    it('provides the HTTP driver', () => {
      const httpDriver = createHttpDriverWithOptions();

      expect(httpDriver).toBeInstanceOf(LumberjackHttpDriver);
    });

    it('registers the specified options', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackHttpDriverConfig = {
        ...options,
        // tslint:disable-next-line: no-any
        levels: jasmine.any(Array) as any,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('gets common options from the log driver config', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({ options });

      const { levels } = httpDriver.config;
      expect(levels).toEqual([LumberjackLevel.Verbose]);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const options = createHttpOptions();

      const httpDriver = createHttpDriverWithOptions({
        options,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = httpDriver.config;
      const expectedConfig: LumberjackHttpDriverConfig = {
        ...options,
        // tslint:disable-next-line: no-any
        levels: jasmine.any(Array) as any,
      };
      expect(actualConfig).toEqual(expectedConfig);
    });
  });
});
