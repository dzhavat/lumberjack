import { ErrorThrowingDriverOptions } from './error-throwing-driver.options';
import { ErrorThrowingDriver } from './error-throwing.driver';

export const defaultErrorThrowingDriverOptions: ErrorThrowingDriverOptions = {
  logsBeforeThrowing: 0,
  driverGUI: ErrorThrowingDriver.name,
};
