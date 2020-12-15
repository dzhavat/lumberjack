import { LumberjackLevel, LumberjackLogDriverConfig } from '@ngworker/lumberjack';

import { SpyDriver } from './spy.driver';

export const defaultSpyDriverConfig: LumberjackLogDriverConfig = {
  levels: [LumberjackLevel.Verbose],
  driverGUI: SpyDriver.name,
};
