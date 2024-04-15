import * as logger from 'fluent-logger';

const transport = {
     host: 'localhost',
     port: 24224,
     timeout: 3000,
     reconnectInterval: 600000,
     requireAckResponse: true
};

const fluentTransport = logger.support.winstonTransport();

export const fluent = new fluentTransport(transport);