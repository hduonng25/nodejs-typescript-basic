import { Result, ResultError, ResultSuccess, error } from '~/result';
import { NextFunction, Request, Response } from 'express';
import errorList, { ErrorData, HttpError } from '~/error';
import { HttpsStatus } from '~/contant';
import { mask } from '~/mark';
import { Middleware } from './common';
import { LoggerProcess } from '~/logger/logger.process';

const logger = new LoggerProcess('Handle result');

//TODO: Middleware resultMiddlewares
export default (env?: string): Middleware => {
     const func = (result: Result | Error, request: Request, response: Response, _: NextFunction): void => {
          let data: ResultError | ResultSuccess;

          if (result instanceof SyntaxError) {
               data = error.syntax(result);
          } else if (result instanceof HttpError) {
               data = result.error;
          } else if (result instanceof Error) {
               console.log('%O', result);

               data = error.exception(result);
          } else {
               data = result;
          }

          handleResult(data, request, response, env);
     };
     return func as NextFunction;
};

function handleResult(data: Result, request: Request, response: Response, env?: string): void {
     const environment = env || 'dev';
     const statusCode = data.status ?? HttpsStatus.BAD_REQUEST;
     let responseData: any;

     if (data.status > 300) {
          let resultError = data as ResultError;
          let { lang } = request.headers;
          lang = lang ?? 'vi';
          const errorCode = resultError.code ?? 'UNKNOWN_ERROR';
          const err = errorList.find((value: ErrorData) => value.errorCode === errorCode);
          let description: string | undefined = undefined;

          if (resultError.description?.vi && lang === 'vi') {
               description = resultError.description.vi;
          }
          if (resultError.description?.en && lang === 'en') {
               description = resultError.description.en;
          }
          if (!description && err && err.description) {
               if (err.description.vi && lang === 'vi') {
                    description = err.description.vi;
               }
               if (err.description.en && lang === 'en') {
                    description = err.description.en;
               }
          }

          responseData = {
               code: errorCode,
               description: description,
               details: resultError.details,
          };
          if (environment === 'dev') {
               responseData['errors'] = resultError.errors;
          }
     } else {
          const resultSuccess = data as ResultSuccess;
          responseData = resultSuccess.data;
     }

     if (responseData !== null && responseData !== undefined) {
          if (typeof responseData.toJSON === 'function') {
               responseData = responseData.toJSON();
          }
     }
     const maskedResponseData = { ...responseData };
     mask(maskedResponseData, ['password', 'accessToken', 'refreshToken']);
     const correlationId = request.correlation_id;
     const request_id = request.request_id;
     const requestBody = JSON.parse(JSON.stringify(request.body));
     mask(requestBody, ['password', 'accessToken', 'refreshToken']);

     logger.response({
          requestId: request_id,
          status: statusCode,
          body: requestBody,
          responseData: maskedResponseData,
          correlationId: correlationId,
     });

     responseData = responseData === undefined ? data : responseData;
     response.status(statusCode).json(responseData);
}

export const notFoundMiddlewares = (req: Request, _: Response, next: NextFunction): void => {
     const requestedUrl = `${req.protocol}://${req.get('Host')}${req.url}`;
     const error = {
          status: HttpsStatus.NOT_FOUND,
          code: 'URL_NOT_FOUND',
          errors: [
               {
                    method: req.method,
                    url: requestedUrl,
               },
          ],
     };
     if (!req.route) {
          next(error);
     }
     next();
};

