import { isClass } from '@internal/test-util';

import { LumberjackLogger, LumberjackLoggerFactoryArguments, LumberjackService } from './index';

describe('Logging API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackLoggerFactoryArguments', () => {
      const value: LumberjackLoggerFactoryArguments | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Services', () => {
    it(`exposes ${LumberjackLogger.name}`, () => {
      const sut = LumberjackLogger;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });

    it(`exposes ${LumberjackService.name}`, () => {
      const sut = LumberjackService;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
