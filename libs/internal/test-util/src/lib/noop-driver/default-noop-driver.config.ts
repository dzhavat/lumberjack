import { LumberjackLevel, LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { NoopDriver } from './noop.driver';

export const defaultNoopDriverConfig: LumberjackLogDriverConfig = {
  levels: [LumberjackLevel.Verbose],
  driverGUI: NoopDriver.name,
};
