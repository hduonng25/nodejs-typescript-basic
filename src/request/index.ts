// interface định nghĩa cấu trúc của đối tượng chứa thông tin payload, có các thuộc tính như id, roles, name, type, và email.
export interface Payload {
    id: string;
    roles: string[];
    name: string;
    type: string;
    email: string;
}

//Đoạn mã này mở rộng module express-serve-static-core để thêm các thuộc tính vào đối tượng Request của Express.
declare module 'express-serve-static-core' {
    export interface Request {
        payload?: Payload;
        request_id: string;
        correlation_id?: string;
        requested_time?: number;
        source_hostname?: string;
        source_netname?: string;
    }
}

export {};
export * from './body';
export * from './query';
