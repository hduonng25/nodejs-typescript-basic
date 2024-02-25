import express, { Application } from 'express';
import { configLogger, configs } from './configs/configs';
import { router } from './routers';
import logger from './logger';
import 'express-async-errors';
import { requestInitialization } from './middleware/initial';
import { parserMiddlewares, resultMiddlewares } from './middleware';
import { notFoundMiddlewares } from './middleware/result';

function main(): void {
    const env = configs.environment;
    const port = Number(configs.app.port);
    const host = configs.app.host;
    configLogger(configs)
    const app: Application = express();
    app.use(parserMiddlewares);
    app.use(requestInitialization);
    app.use(router);
    app.use(notFoundMiddlewares);
    app.use(resultMiddlewares(env));

    const startApp = (): void => {
        app.listen(Number(port), host, () => {
            logger.info('Listening on: %s:%d', host, port);
        });
    };

    startApp();
}

main();

export * from './request';
