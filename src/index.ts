import { configs } from './configs/configs';
import { router } from './routers';
import createApp from './app';
import { setKeyVerify } from './middleware';
import { LoggerProcess } from './logger/logger.process';
import logger from './logger';
// import { connectToMongo } from './database';

function main(): void {
    const app = createApp(router, configs);
    const port = Number(configs.app.port);
    const host = configs.app.host;
    setKeyVerify(configs.keys.public_key);
    const startApp = (): void => {
        app.listen(Number(port), host, () => {
            logger.info(`Listening on: ${host}:${port}`);
        });
    };

    // connectToMongo(() => {
    startApp();
    // });
}

main();
