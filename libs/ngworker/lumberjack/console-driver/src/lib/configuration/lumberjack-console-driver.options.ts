import { LumberjackLogDriverConfig } from '@ngworker/lumberjack';

export type LumberjackConsoleDriverOptions = Omit<LumberjackLogDriverConfig, 'levels'>;
