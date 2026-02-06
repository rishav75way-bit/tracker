import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { User } from './User.model';
import { RegisterInput, LoginInput } from './auth.validators';
import { AppError } from '../../common/middleware';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../common/utils';
import { env } from '../../../config/env';

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as StringValue,
    });
};

export const authService = {
    register: async (input: RegisterInput): Promise<AuthResponse> => {
        const existingUser = await User.findOne({ email: input.email });

        if (existingUser) {
            throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.EMAIL_EXISTS);
        }

        const passwordHash = await bcrypt.hash(input.password, 10);

        const user = await User.create({
            email: input.email,
            passwordHash,
        });

        const token = generateToken(user._id.toString());

        return {
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
            },
        };
    },

    login: async (input: LoginInput): Promise<AuthResponse> => {
        const user = await User.findOne({ email: input.email });

        if (!user) {
            throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const token = generateToken(user._id.toString());

        return {
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
            },
        };
    },
};
