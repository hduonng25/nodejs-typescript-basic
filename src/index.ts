import { configs } from './configs/configs';
import { router } from './routers';
import logger from './logger';
import createApp from './app';
import { setKeyVerify } from './middleware';
import { connectToMongo } from './database';

function main(): void {
    const app = createApp(router, configs);
    const port = Number(configs.app.port);
    const host = configs.app.host;
    setKeyVerify(configs.keys.public_key);
    const startApp = (): void => {
        app.listen(Number(port), host, () => {
            // logger.info('Listening on: %s:%d', host, port);
            console.log('Listening on: %s:%d', host, port);
        });
    };

    connectToMongo(() => {
        startApp();
    });
}

main();
