import { Result, ResultError, ResultSuccess, error } from '~/result';
import { NextFunction, Request, Response } from 'express';
import errorList, { ErrorData, HttpError } from '~/error';
import { HttpsStatus } from '~/contant';
import logger from '~/logger';
import { mask } from '~/mark';
import { Middleware } from './common';

//TODO: Middleware resultMiddlewares
export default (env?: string): Middleware => {
    const func = (
        result: Result | Error,
        request: Request,
        response: Response,
        _: NextFunction,
    ): void => {
        let data: ResultError | ResultSuccess;

        // Xử lý kiểu kết quả nhận được để đảm bảo nó là một instance của ResultError hoặc ResultSuccess
        if (result instanceof SyntaxError) {
            data = error.syntax(result);
        } else if (result instanceof HttpError) {
            data = result.error;
        } else if (result instanceof Error) {
            logger.error('%O', result);
            data = error.exception(result);
        } else {
            data = result;
        }

        handleResult(data, request, response, env);
    };
    return func as NextFunction;
};

//Khi goi next() tu router, du lieu tu router handler se duoc chuyen den middleware tiep theo de su dung
//Trong middleware resultMiddlewares tham so result la tham so dau tien cua ham middleware va no se nhan gia tri cua mess duoc truyen tu router handel
//Khi su dung next() tuc la truyen gia tri cua mess cho tham so dau tien cua ham middleware tiep theo

function handleResult(
    data: Result,
    request: Request,
    response: Response,
    env?: string,
): void {
    const environment = env || 'dev';
    const statusCode = data.status ?? HttpsStatus.BAD_REQUEST;
    let responseData: any;

    // Kiểm tra status code để xác định loại kết quả (lỗi hay thành công)
    if (data.status > 300) {
        // Xử lý lỗi
        let resultError = data as ResultError;
        let { lang } = request.headers;
        lang = lang ?? 'vi';
        const errorCode = resultError.code ?? 'UNKNOWN_ERROR';
        const err = errorList.find(
            (value: ErrorData) => value.errorCode === errorCode,
        );
        let description: string | undefined = undefined;

        // Xác định ngôn ngữ cho mô tả lỗi
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

        // Xây dựng đối tượng responseData cho lỗi
        responseData = {
            code: errorCode,
            description: description,
            details: resultError.details,
        };
        if (environment === 'dev') {
            responseData['errors'] = resultError.errors;
        }
    } else {
        // Xử lý thành công
        const resultSuccess = data as ResultSuccess;
        responseData = resultSuccess.data;
    }

    // Kiểm tra và chuyển đổi responseData thành JSON nếu có thể
    if (responseData !== null && responseData !== undefined) {
        if (typeof responseData.toJSON === 'function') {
            responseData = responseData.toJSON();
        }
    }
    const maskedResponseData = { ...responseData };
    //An cac truong thong tin nhay cam bang mark
    mask(maskedResponseData, ['password', 'accessToken', 'refreshToken']);
    const correlationId = request.correlation_id;
    const request_id = request.request_id;
    const requestBody = JSON.parse(JSON.stringify(request.body));
    mask(requestBody, ['password', 'accessToken', 'refreshToken']);

    logResponse(
        request_id,
        statusCode,
        maskedResponseData,
        correlationId,
        responseData
    );

    // Gán giá trị của data cho responseData (nếu responseData không được gán từ phía trên)
    responseData = responseData === undefined ? data : responseData;
    // Trả về kết quả cho client
    response.status(statusCode).json(responseData);
}

//TODO: kiem tra xem co router nao xu ly request khong, neu khong tra ra loi URL_NOT_FOUND
export const notFoundMiddlewares = (
    req: Request,
    _: Response,
    next: NextFunction,
): void => {
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

const logResponse = (
    request_id: string,
    status_code: HttpsStatus,
    body: any,
    correlation_id?: string,
    responseData?: any
): void => {
    const response_time = new Date();
    const data = {
        request_id,
        correlation_id,
        response_time,
        status_code,
        body,
        responseData
    };

    logger.info(JSON.stringify(data), {
        tags: ['response'],
    });
};
