import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
