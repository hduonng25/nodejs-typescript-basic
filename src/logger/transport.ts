import Transport from 'winston-transport';
import net from 'net';

//interface định nghĩa thông tin cần thiết để kết nối đến server Logstash.
export interface ServerLogstashInfomation {
    host: string;
    port: number;
    protocol: 'udp' | 'tcp';
}

//một type kế thừa từ ServerLogstashInfomation và Transport.TransportStreamOptions, đại diện cho các tùy chọn cấu hình cho transport Logstash.
export type LogstashTransportOptions = ServerLogstashInfomation &
    Transport.TransportStreamOptions & {
        service: string;
    };

// class mở rộng từ Transport của Winston, nó chứa logic để gửi log đến Logstash.
export class LogstashTransport extends Transport {
    private host: string;
    private port: number;
    private protocol: 'udp' | 'tcp';
    private service: string;

    //Constructor của LogstashTransport nhận các tùy chọn từ đối số và lưu trữ chúng trong các thuộc tính của class.
    constructor(opts: LogstashTransportOptions) {
        super(opts);
        this.host = opts.host;
        this.port = opts.port;
        this.protocol = opts.protocol;
        this.service = opts.service;
    }

    //Phương thức log được triệu gọi khi một log được ghi. Nó kiểm tra giao thức,
    //nếu là TCP thì gửi log bằng cách gọi sendLogByTcp, sau đó gọi hàm next() để thông báo rằng đã xử lý xong.
    public log(info: any, next: () => void): void {
        setImmediate(() => {
            this.emit('logged', info);
        });
        if (this.protocol === 'tcp') {
            this.sendLogByTcp(info);
        }
        next();
    }

    //Phương thức này tạo một kết nối TCP đến server Logstash và gửi log thông qua kết nối này.
    sendLogByTcp(info: any): void {
        const message = this.getMessage(info);
        const client = net
            .createConnection(
                { host: this.host, port: this.port },
                function () {
                    client.write(message, (err) => {
                        client.destroy();
                        if (err) {
                            throw err;
                        }
                    });
                },
            )
            .on('error', function (err) {
                throw err;
            });
    }

    //Phương thức này chuyển đổi thông tin log thành định dạng mong muốn và trả về dưới dạng chuỗi JSON.
    getMessage(info: any): string {
        if (info.exception) {
            info = {
                message: info.message,
                level: info.level,
                tags: ['exception'],
            };
        }
        if (info.tags) {
            info['@tags'] = info.tags;
            delete info.tags;
        }
        if (info.level) {
            info['@level'] = info.level;
            delete info.level;
        }
        info['@service'] = this.service;
        return JSON.stringify(info);
    }
}
