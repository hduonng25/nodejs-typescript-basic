import { Request } from 'express';
import { matchedData } from 'express-validator';

export function matchedQuery<T>(req: Request): T {
    //<T>: Dấu hiệu generic, nói cho TypeScript biết rằng kiểu trả về của hàm là kiểu được chỉ định bởi generic T.
    // Hàm matchedData được sử dụng để trích xuất dữ liệu đã được kiểm tra từ query parameters (locations: ['query'] chỉ định rằng chỉ quan tâm đến query parameters).
    // Hàm trả về dữ liệu đã được kiểm tra từ query parameters với kiểu là generics T. Dấu hiệu <T> ở đây giúp TypeScript biết được kiểu của dữ liệu trả về.
    return <T>matchedData(req, { locations: ['query'] });
}
