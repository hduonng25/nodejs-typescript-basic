import { configs } from '~/configs';
import mongoose, { ConnectOptions } from 'mongoose';
import logger from '~/logger';

export function connectToMongo(onSuccess: () => void): void {
    const connectionUri = configs.mongo.getUri();
    mongoose.set('strictQuery', false);
    mongoose
        .connect(connectionUri, {} as ConnectOptions)
        .then(() => {
            logger.info('Connected to mongo successfuly');
            onSuccess();
        })
        .catch((err) => {
            logger.error('%O', err);
        });
}
