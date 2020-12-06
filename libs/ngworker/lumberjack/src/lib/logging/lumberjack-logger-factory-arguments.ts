// tslint:disable-next-line: no-any
export interface LumberjackLoggerFactoryArguments<TCustomLog extends Record<string, any> | undefined = undefined> {
  readonly context?: string;
  readonly customLog: TCustomLog;
  readonly message: string;
}
