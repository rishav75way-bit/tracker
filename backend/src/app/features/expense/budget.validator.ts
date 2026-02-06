import { z } from 'zod';

export const setBudgetSchema = z.object({
    monthlyLimit: z.number().min(0, 'Budget must be at least 0'),
    month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
});

export type SetBudgetInput = z.infer<typeof setBudgetSchema>;
