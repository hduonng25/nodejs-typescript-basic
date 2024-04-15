import logger from '.';

export class LoggerProcess {
     constructor(private readonly from: string) {}

     public debug(data: any) {
          logger.info(JSON.stringify(data), {
               tags: 'Debug',
               from: this.from,
          });
     }

     public request(data: any) {
          logger.info(JSON.stringify(data), {
               tags: 'Request',
               from: this.from,
          });
     }

     public response(data: any) {
          logger.info(JSON.stringify(data), {
               tags: 'Response',
               from: this.from,
          });
     }
}
