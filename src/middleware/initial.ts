import { NextFunction, Request, Response } from 'express';
import { v1 } from 'uuid';
import { setCorrelationId } from '~/hook';
import logger from '~/logger';
import { mask } from '~/mark';

//Đoạn mã này là một middleware trong Express, được thiết lập để thực hiện các công việc chuẩn bị cho mỗi request trước khi nó được xử lý bởi các route handlers.
export const requestInitialization = (
    req: Request,
    _: Response,
    next: NextFunction,
): void => {
    //Tạo một timestamp mới để đánh dấu thời điểm request được thực hiện (timeNow).
    //Tạo một ID request mới sử dụng UUID (req.request_id).
    //Tạo một bản sao của dữ liệu trong req.body và ẩn các giá trị nhạy cảm bằng cách sử dụng hàm mask.
    const timeNow = new Date();
    req.request_id = v1();
    const body = JSON.parse(JSON.stringify(req.body));
    mask(body, ['password', 'accessToken', 'refreshToken']);

    //Thu thập thông tin về người gửi request như địa chỉ IP (client), tên máy chủ gửi forward (sourceHostName), tên mạng gửi forward (sourceNetName), và correlation ID từ header của request.
    const client =
        req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const sourceHostName =
        req.headers['x-forwarded-for-hostname'] || 'unknown';
    const sourceNetName =
        req.headers['x-forwarded-for-netname'] || 'unknown';
    const correlationId = req.headers['x-correlation-id'] || v1();

    //Gán các giá trị thu thập được vào các thuộc tính của req để chúng có thể được sử dụng trong các middleware và route handlers khác. Đồng thời, set correlation ID bằng cách sử dụng hàm setCorrelationId từ module hook.
    req.source_hostname = String(sourceHostName);
    req.source_netname = String(sourceNetName);
    req.correlation_id = String(correlationId);
    req.requested_time = timeNow.getTime();
    setCorrelationId(String(correlationId));

    //Tạo một object data chứa thông tin cơ bản về request và ghi log nó bằng cách sử dụng logger (logger.info). Điều này giúp theo dõi các request và thông tin liên quan của chúng.
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

    logger.info(JSON.stringify(data), {
        tags: ['request'],
    });

    //Gọi hàm next() để chuyển giao điều khiển đến middleware hoặc route handler tiếp theo trong chuỗi xử lý request.
    next();
};
