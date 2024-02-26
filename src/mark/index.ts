export function mask(x: any, fields = ['password']): any {
    for (const k in x) {
        //Nếu giá trị của thuộc tính là một đối tượng và có phương thức toObject, thì hàm sẽ gọi phương thức này để chuyển đối tượng về dạng plain object.
        //Điều này giúp đảm bảo rằng các đối tượng Mongoose (chẳng hạn) được chuyển đổi thành plain object trước khi xử lý.
        if (x[k] && typeof x[k].toObject === 'function') {
            x[k] = x[k].toObject();
        }
        //Nếu giá trị của thuộc tính là một đối tượng (nhưng không phải là mảng), hàm sẽ đệ quy gọi chính nó để xử lý đối tượng con
        if (typeof x[k] === 'object' && !Array.isArray(x[k])) {
            mask(x[k], fields);
        } else if (fields.includes(k)) {
            //Nếu tên trường nằm trong danh sách các trường cần ẩn (fields), thì giá trị của trường đó sẽ được thay thế bằng chuỗi "***", làm cho thông tin này trở thành không đọc được.
            x[k] = '***';
        }
    }
}
//fields (mặc định là ['password']): Một mảng chứa tên các trường cần được ẩn đi. Mặc định là chỉ có trường "password" sẽ được ẩn.
//Hàm mask này được thiết kế để "ẩn đi" (mask) các giá trị trong một đối tượng (object) dựa trên danh sách các trường (fields) cần được ẩn đi.
//Điều này thường được sử dụng để bảo vệ thông tin nhạy cảm, chẳng hạn như mật khẩu, khi xuất thông tin ra khỏi ứng dụng hoặc khi ghi log.
