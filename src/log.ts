import { Logger } from "../types/log";

const simpleNodeLogger = require('simple-node-logger');
const logger: Logger = simpleNodeLogger.createSimpleLogger('logs/basic.log');

function newLog(path: string): Logger {
  return simpleNodeLogger.createSimpleLogger(path);
}

export { logger as log, newLog }
