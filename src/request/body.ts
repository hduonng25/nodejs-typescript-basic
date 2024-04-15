import { Request } from 'express';
import { matchedData } from 'express-validator';

export function matchedBody<T>(req: Request): T {
     //Hàm này có kiểu trả về là generics T, nghĩa là nó sẽ trả về một kiểu dữ liệu được chỉ định khi gọi hàm.
     //req: Request: Hàm nhận một đối tượng Request từ Express làm tham số đầu vào.
     //matchedData(req, { locations: ['body'] }): Hàm matchedData được sử dụng để trích xuất dữ liệu đã được kiểm tra từ phần body của request (locations: ['body'] chỉ định rằng chỉ quan tâm đến phần body).
     //<T>: Dấu hiệu generic, nói cho TypeScript biết rằng kiểu trả về của hàm là kiểu được chỉ định bởi generic T.
     //return <T>matchedData(req, { locations: ['body'] });: Hàm trả về dữ liệu đã được kiểm tra từ phần body của request với kiểu là generics T. Dấu hiệu <T> ở đây giúp TypeScript biết được kiểu của dữ liệu trả về.
     return <T>matchedData(req, { locations: ['body'] });
}
