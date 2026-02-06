import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const jwtExpiresInSchema = z
    .string()
    .regex(/^\d+[smhdwy]$/, 'JWT_EXPIRES_IN must be a valid time string')
    .default('7d');

const envSchema = z.object({
    PORT: z.string().default('5000'),
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
    JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_EXPIRES_IN: jwtExpiresInSchema,
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('Environment validation failed:', parsed.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
};

export const env = validateEnv();
