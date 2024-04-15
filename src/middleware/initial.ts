import { NextFunction, Request, Response } from 'express';
import { v1 } from 'uuid';
import { setCorrelationId } from '~/hook';
import { LoggerProcess } from '~/logger/logger.process';
import { mask } from '~/mark';

export const requestInitialization = (req: Request, _: Response, next: NextFunction): void => {
     const logger = new LoggerProcess('Request initialization');

     const timeNow = new Date();
     req.request_id = v1();
     const body = JSON.parse(JSON.stringify(req.body));
     mask(body, ['password', 'accessToken', 'refreshToken']);

     const client = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
     const sourceHostName = req.headers['x-forwarded-for-hostname'] || 'unknown';
     const sourceNetName = req.headers['x-forwarded-for-netname'] || 'unknown';
     const correlationId = req.headers['x-correlation-id'] || v1();

     req.source_hostname = String(sourceHostName);
     req.source_netname = String(sourceNetName);
     req.correlation_id = String(correlationId);
     req.requested_time = timeNow.getTime();
     setCorrelationId(String(correlationId));

     const data = {
          sourceHostName,
          sourceNetName,
          request_id: req.request_id,
          correlation_id: correlationId,
          request_time: timeNow,
          requester: client,
          method: req.method,
          url: req.url,
          body,
     };

     logger.request(data);

     next();
};
