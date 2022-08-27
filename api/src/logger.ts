import winston from 'winston';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const loggerConfig = {
  level: LOG_LEVEL,
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
  meta: false,
};

export const logger = winston.createLogger(loggerConfig);
