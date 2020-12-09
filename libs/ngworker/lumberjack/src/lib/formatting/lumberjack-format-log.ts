import { LumberjackLog } from '../logs/lumberjack.log';

import { utcTimestampFor } from './utc-timestamp-for';

// tslint:disable-next-line: no-any
export function lumberjackFormatLog<F extends Record<string, unknown> | void = void>({
  context,
  createdAt: timestamp,
  level,
  message,
}: LumberjackLog<F>) {
  return `${level} ${utcTimestampFor(timestamp)}${context ? ` [${context}]` : ''} ${message}`;
}
