import { Request, Response } from 'express';
import { authService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validators';
import { asyncHandler, HTTP_STATUS } from '../../common/utils';
import { SuccessResponse } from '../../common/types';

export const authController = {
    register: asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
            message: 'User registered successfully',
        };

        res.status(HTTP_STATUS.CREATED).json(response);
    }),

    login: asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const validatedData = loginSchema.parse(req.body);
        const result = await authService.login(validatedData);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
            message: 'Login successful',
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),
};
