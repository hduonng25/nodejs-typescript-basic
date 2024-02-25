import express, { Application, Router } from 'express';
import { AppConfigurations, configLogger } from './configs';
import {
    parserMiddlewares,
    requestInitialization,
    resultMiddlewares,
} from './middleware';
import { notFoundMiddlewares } from './middleware/result';

const createApp = (
    applicationRouter: Router,
    configs: AppConfigurations,
): Application => {
    const env = configs.environment;
    configLogger(configs);
    const app: Application = express();
    app.use(parserMiddlewares);
    app.use(requestInitialization);
    app.use(applicationRouter);
    app.use(notFoundMiddlewares);
    app.use(resultMiddlewares(env));
    return app;
};

export default createApp;
export * from './request';
