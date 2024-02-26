export interface AppConfigurations {
    environment: string;
    service: string;

    mongo: {
        dbName: string;
        username: string;
        password: string;
        port: string;
        host: string;
        configUri: string;
        getUri: () => string;
    };

    log?: {
        logFileEnabled: string;
        folderLogsPath: string;
        logstashEnabled: string;
        logstashHost: string;
        logstashPort: string;
        logstashProtocol: string;
    };

    app: {
        prefix: string;
        host: string;
        port: string;
    };

    keys: {
        private_key: string;
        public_key: string;
    };
}
