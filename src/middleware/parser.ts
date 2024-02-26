import { json, urlencoded } from 'express';
import { Middleware } from './common';

export default [
    json({ limit: '50mb' }),
    urlencoded({ extended: true, limit: '10mb' }),
] as Middleware[];

//đoạn mã này cấu hình hai middleware trong Express để xử lý dữ liệu JSON và x-www-form-urlencoded từ các request,
//đồng thời áp dụng các giới hạn kích thước cho dung lượng của chúng.
//Các middleware này có thể được sử dụng trong ứng dụng Express để tiếp nhận và xử lý các loại dữ liệu khác nhau từ các request
