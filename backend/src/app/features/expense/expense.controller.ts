import { Response } from 'express';
import { expenseService } from './expense.service';
import {
    createExpenseSchema,
    updateExpenseSchema,
    getExpensesQuerySchema,
} from './expense.validator';
import { setBudgetSchema } from './budget.validator';
import { asyncHandler, HTTP_STATUS } from '../../common/utils';
import { AuthenticatedRequest, SuccessResponse } from '../../common/types';

export const expenseController = {
    create: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const validatedData = createExpenseSchema.parse(req.body);
        const result = await expenseService.create(req.userId!, validatedData);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
            message: 'Expense created successfully',
        };

        res.status(HTTP_STATUS.CREATED).json(response);
    }),

    getAll: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const validatedQuery = getExpensesQuerySchema.parse(req.query);
        const result = await expenseService.getAll(req.userId!, validatedQuery);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    getById: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await expenseService.getById(req.userId!, req.params.id as string);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    update: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const validatedData = updateExpenseSchema.parse(req.body);
        const result = await expenseService.update(req.userId!, req.params.id as string, validatedData);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
            message: 'Expense updated successfully',
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    delete: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        await expenseService.delete(req.userId!, req.params.id as string);

        const response: SuccessResponse<null> = {
            success: true,
            data: null,
            message: 'Expense deleted successfully',
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    getSummary: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const validatedQuery = getExpensesQuerySchema.parse(req.query);
        const result = await expenseService.getSummary(req.userId!, validatedQuery);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    getCategoryStats: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const validatedQuery = getExpensesQuerySchema.parse(req.query);
        const result = await expenseService.getCategoryStats(req.userId!, validatedQuery);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    getMonthlyStats: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const result = await expenseService.getMonthlyStats(req.userId!);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    getBudget: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const month = req.query.month as string;
        const result = await expenseService.getBudget(req.userId!, month);

        const response: SuccessResponse<number> = {
            success: true,
            data: result,
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),

    setBudget: asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const validatedData = setBudgetSchema.parse(req.body);
        const result = await expenseService.setBudget(req.userId!, validatedData);

        const response: SuccessResponse<number> = {
            success: true,
            data: result,
            message: 'Budget set successfully',
        };

        res.status(HTTP_STATUS.OK).json(response);
    }),
};
