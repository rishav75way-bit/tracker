import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';
import { env } from '../../../config/env';
import { AuthenticatedRequest } from '../types';

interface JwtPayload {
    userId: string;
}

export const authMiddleware = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }
};
