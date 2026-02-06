import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '../../common/utils';

export const createExpenseSchema = z.object({
    amount: z
        .number()
        .positive('Amount must be positive')
        .max(1000000000, 'Amount is too large'),
    category: z.enum(EXPENSE_CATEGORIES),
    date: z.string().datetime('Invalid date format'),
    note: z.string().max(500, 'Note must not exceed 500 characters').optional(),
});

export const updateExpenseSchema = z.object({
    amount: z
        .number()
        .positive('Amount must be positive')
        .max(1000000000, 'Amount is too large')
        .optional(),
    category: z.enum(EXPENSE_CATEGORIES).optional(),
    date: z.string().datetime('Invalid date format').optional(),
    note: z.string().max(500, 'Note must not exceed 500 characters').optional(),
});

export const getExpensesQuerySchema = z.object({
    category: z.enum(EXPENSE_CATEGORIES).optional(),
    startDate: z.string().datetime('Invalid start date format').optional(),
    endDate: z.string().datetime('Invalid end date format').optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type GetExpensesQuery = z.infer<typeof getExpensesQuerySchema>;
