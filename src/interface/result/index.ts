import { HttpsStatus } from '~/contant';

export interface ResultSuccess {
    status: HttpsStatus;
    data: any;
}

export interface ResultError {
    status: HttpsStatus;
    code?: string;
    description?: {
        vi: string;
        en: string;
    };
    errors?: ErrorDetail[];
    details?: any;
}

export interface ErrorDetail {
    location?: string;
    value?: any;
    param?: string;
    message?: string;
}

export type Result = ResultSuccess | ResultError;
