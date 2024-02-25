import { configs } from './configs/configs';
import { router } from './routers';
import logger from './logger';
import createApp from './app';

function main(): void {
    const app = createApp(router, configs);
    const port = Number(configs.app.port);
    const host = configs.app.host;
    const startApp = (): void => {
        app.listen(Number(port), host, () => {
            logger.info('Listening on: %s:%d', host, port);
        });
    };

    startApp();
}

main();


