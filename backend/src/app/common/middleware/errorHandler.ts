import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';
import { ErrorResponse } from '../types';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError | ZodError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        err.issues.forEach((issue) => {
            const path = issue.path.join('.');
            if (!errors[path]) {
                errors[path] = [];
            }
            errors[path].push(issue.message);
        });

        const response: ErrorResponse = {
            success: false,
            message: ERROR_MESSAGES.VALIDATION_ERROR,
            errors,
        };

        res.status(HTTP_STATUS.BAD_REQUEST).json(response);
        return;
    }

    if (err instanceof AppError) {
        const response: ErrorResponse = {
            success: false,
            message: err.message,
        };

        res.status(err.statusCode).json(response);
        return;
    }

    const response: ErrorResponse = {
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
    };

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};
