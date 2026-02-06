import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export interface SuccessResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
