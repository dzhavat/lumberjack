import { LumberjackLog } from '../logs/lumberjack.log';

// tslint:disable-next-line: no-any
export interface LumberjackLogDriverLog<TPayload extends Readonly<{ [key: string]: unknown }> | void = void> {
  readonly formattedLog: string;
  readonly log: LumberjackLog<TPayload>;
}
