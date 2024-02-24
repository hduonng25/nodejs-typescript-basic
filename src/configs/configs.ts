import 'dotenv/config';
import logger from '~/logger';

export interface AppConfigurations {
    environment: string;
    service: string;

    mongo?: {
        dbName: string;
        username: string;
        password: string;
        port: string;
        host: string;
        configUri: string;
        getUri: () => string;
    };

    app: {
        prefix: string;
        host: string;
        port: string;
    };

    keys?: {
        private_key: string;
        public_key: string;
    };
}

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

    app: {
        prefix: process.env.PREFIX || '/api/v1',
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || '',
    },
};