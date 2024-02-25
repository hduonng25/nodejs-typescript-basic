import Transport from 'winston-transport';
import 'winston-daily-rotate-file';
import winston, { LoggerOptions } from 'winston';
import { LoggerConfigurations } from '~/interface/logger';
import { LogstashTransport } from './transport';
import { configs } from '~/configs';

//Hàm này trả về một mảng các transport dựa trên cấu hình được truyền vào.
function getTransports(config?: LoggerConfigurations): Transport[] {
    const fileEnabled =
        config?.logFileEnabled === 'true' ? true : false;
    const logstashEnabled =
        config?.logstashEnabled === 'true' ? true : false;
    const logsPath = config?.folderLogsPath || 'logs';
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

    const transports: Transport[] = [
        new winston.transports.Console(options.console),
    ];

    //Kiểm tra nếu cấu hình cho việc ghi log vào file (fileEnabled) được bật, thì thêm một transport winston.transports.DailyRotateFile vào mảng transport.
    if (fileEnabled) {
        const transport = new winston.transports.DailyRotateFile(
            options.file,
        );
        transports.push(transport);
    }

    //Kiểm tra nếu cấu hình cho việc gửi log đến Logstash (logstashEnabled) được bật, thì thêm một transport LogstashTransport vào mảng transport.
    if (logstashEnabled) {
        const logstashHost = config?.logstashHost;
        const logstashPort = config?.logstashPort;
        const logstashProtocol = config?.logstashProtocol;

        if (!logstashHost) {
            throw new Error('');
        }
        if (!logstashPort && !Number.isInteger(logstashPort)) {
            throw new Error('');
        }
        if (
            !logstashProtocol &&
            logstashProtocol != 'udp' &&
            logstashProtocol != 'tcp'
        ) {
            throw new Error('');
        }
        const transport = new LogstashTransport({
            level: 'info',
            host: logstashHost,
            port: Number(logstashPort),
            protocol: logstashProtocol as 'udp' | 'tcp',
            handleExceptions: true,
            service: config.service,
        });
        transports.push(transport);
    }
    return transports;
}

//Hàm này trả về các tùy chọn cấu hình cho logger dựa trên cấu hình được truyền vào.
function getOptions(config?: LoggerConfigurations): LoggerOptions {
    return {
        //Sử dụng format của Winston để định dạng log messages.
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS',
            }),
            winston.format.printf(
                (info: winston.Logform.TransformableInfo) => {
                    let tags = '';
                    if (info.tags && Array.isArray(info.tags)) {
                        tags = info.tags
                            .map((t) => `[${t}]`)
                            .join('');
                    }
                    return `${info.timestamp} [${info.level}][service:${configs?.service}]${tags}: ${info.message}`;
                },
            ),
        ),

        //Gọi hàm getTransports để lấy mảng các transport và sử dụng chúng trong tùy chọn transports.
        transports: getTransports(config),
        exitOnError: false,
    };
}

//Đoạn mã này mở rộng module winston để thêm thuộc tính config vào đối tượng Logger.
declare module 'winston' {
    interface Logger {
        config: typeof setConfiguration;
    }
}

//Hàm này được sử dụng để cấu hình logger dựa trên cấu hình được truyền vào.
function setConfiguration(
    //Hàm này được gọi để thay đổi cấu hình của logger.
    this: winston.Logger,
    config: LoggerConfigurations,
): void {
    //Gọi hàm getOptions để lấy các tùy chọn cấu hình mới dựa trên cấu hình được truyền vào.
    const options = getOptions(config);

    //Sử dụng hàm this.configure(options) để cấu hình lại logger.
    this.configure(options);
}

//Tạo một đối tượng logger sử dụng winston.createLogger và cấu hình nó với các tùy chọn từ getOptions.
const logger = winston.createLogger(getOptions());
logger.config = setConfiguration;

export default logger;
