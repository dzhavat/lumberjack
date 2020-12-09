import { LumberjackLogDriver } from './lumberjack-log-driver';

// tslint:disable-next-line: no-any
export interface LumberjackLogDriverError<F extends Record<string, unknown> | void = void> {
  readonly formattedLog: string;
  readonly error: unknown;
  readonly logDriver: LumberjackLogDriver<F>;
}
