import Transport from 'winston-transport';
import 'winston-daily-rotate-file';
import winston, { LoggerOptions } from 'winston';
import { LoggerConfigurations } from '~/interface/logger';
import { LogstashTransport } from './transport';
import { fluent } from './fluentBit/config';

function getTransports(configs?: LoggerConfigurations): Transport[] {
     const fileEnabled = configs?.logFileEnabled === 'true' ? true : false;
     const logstashEnabled = configs?.logstashEnabled === 'true' ? true : false;
     const logsPath = configs?.folderLogsPath || 'logs';
     const options = {
          file: {
               level: 'info',
               datePattern: 'YYYY-MM-DD-HH',
               filename: `${logsPath}/app-%DATE%.log`,
               handleExceptions: true,
               maxFiles: '14d',
               colorize: true,
               maxSize: '20m',
               json: true,
          },
          console: {
               level: 'debug',
               handleExceptions: true,
               colorize: true,
               json: false,
          },
     };

     const transports: Transport[] = [fluent, new winston.transports.Console(options.console)];
     if (fileEnabled) {
          const transport = new winston.transports.DailyRotateFile(options.file);
          transports.push(transport);
     }
     if (logstashEnabled) {
          const logstashHost = configs?.logstashHost;
          const logstashPort = configs?.logstashPort;
          const logstashProtocol = configs?.logstashProtocol;

          if (!logstashHost) {
               throw new Error('');
          }
          if (!logstashPort && !Number.isInteger(logstashPort)) {
               throw new Error('');
          }
          if (!logstashProtocol && logstashProtocol != 'udp' && logstashProtocol != 'tcp') {
               throw new Error('');
          }
          const transport = new LogstashTransport({
               level: 'info',
               host: logstashHost,
               port: Number(logstashPort),
               protocol: logstashProtocol as 'udp' | 'tcp',
               handleExceptions: true,
               service: configs.service,
          });
          transports.push(transport);
     }
     return transports;
}

function getOptions(config?: LoggerConfigurations): LoggerOptions {
     return {
          format: winston.format.combine(
               winston.format.splat(),
               winston.format.timestamp({
                    format: 'YYYY-MM-DD, HH:mm:ss.SSS',
               }),
               winston.format.printf((info: winston.Logform.TransformableInfo) => {
                    return formatPrintf(info);
               }),
          ),

          transports: getTransports(config),
          exitOnError: false,
     };
}

const formatPrintf = (info: winston.Logform.TransformableInfo) => {
     const level: string = info.level.toUpperCase();
     const tag: string = (!info.tags ? 'APP' : info.tags).toUpperCase();
     const from: string = !info.from ? 'APP' : info.from;

     const result: string = `[${tag}] - ${info.timestamp} - [${level}] - [FROM: ${from}]: ${info.message}`;

     if (info.exception) {
          info = {
               message: info.message,
               level: info.level,
               tags: ['exception'],
          };
     }

     if (info.tags) {
          info['@tags'] = tag;
          delete info.tags;
     }
     if (info.level) {
          info['@level'] = info.level;
     }
     info['@from'] = info.from;
     delete info.from;

     return result;
};

declare module 'winston' {
     interface Logger {
          config: typeof setConfiguration;
     }
}

function setConfiguration(this: winston.Logger, config: LoggerConfigurations): void {
     const options = getOptions(config);
     this.configure(options);
}

const logger = winston.createLogger(getOptions());
logger.config = setConfiguration;

export default logger;
