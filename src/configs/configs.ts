import 'dotenv/config';
import { AppConfigurations } from '~/interface/config';
import logger from '~/logger';

export const configs: AppConfigurations = {
    environment: process.env.ENVIRONMENT || 'dev',
    service: 'test',
    mongo: {
        dbName: process.env.DB_NAME || '',
        username: process.env.USER_DB || '',
        password: process.env.PASSWORD_DB || '',
        port: process.env.PORT_DB || '',
        host: process.env.HOST_DB || '',

        configUri:
            'mongodb://${username}:${password}@${host}:${port}/${dbName}?retryWrites=true&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`;',

        getUri: function (): string {
            let uri = this.configUri;
            uri = uri.replace('${username}', this.username);
            uri = uri.replace('${password}', this.password);
            uri = uri.replace('${host}', this.host);
            uri = uri.replace('${port}', this.port);
            uri = uri.replace('${dbName}', this.dbName);
            uri = uri.replace('${dbName}', this.dbName);
            uri = `${uri}`;
            return uri;
        },
    },

    log: {
        logFileEnabled: process.env.LAB_LOG_FILE_ENABLED || 'true',
        folderLogsPath:
            process.env.LAB_FOLDER_LOGS_PATH ||
            `${__dirname}../../../logs`,

        logstashEnabled:
            process.env.LAB_LOG_LOGSTASH_ENABLED || 'false',
        logstashHost:
            process.env.LAB_LOG_LOGSTASH_HOST || '127.0.0.1',
        logstashPort: process.env.LAB_LOG_LOGSTASH_PORT || '50001',
        logstashProtocol:
            process.env.LAB_LOG_LOGSTASH_PROTOCOL || 'udp',
    },

    app: {
        prefix: process.env.PREFIX || '/api/v1',
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || '',
    },
};

export function configLogger(configs: AppConfigurations): void {
    logger.config({
        service: configs.service,
        ...configs.log,
    });
}
