import * as winston from 'winston'

/**
 * Create a logger instance to write log message in JSON format
 * @param name of the logger that would be added to all logged message
 * @returns a logger instance of the `loggerName`
 */
export function createLogger(loggerName: string) {
  return winston.createLogger({
    level: `info`,
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [new winston.transports.Console()]
  })
}
