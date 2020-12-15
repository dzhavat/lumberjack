import { LumberjackLogDriverConfig } from './lumberjack-log-driver.config';

export type LumberjackLogDriverOptions = Pick<LumberjackLogDriverConfig, 'levels'>;
