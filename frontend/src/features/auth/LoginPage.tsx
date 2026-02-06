import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/config/AuthContext';
import { apiClient } from '../../app/api/client';
import { API_PATHS, ROUTES } from '../../shared/constants';
import { Button, Input, ErrorMessage } from '../../shared/components';
import type { ApiResponse, AuthResponse } from '../../app/types';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (values: LoginFormValues) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await apiClient.post<unknown, ApiResponse<AuthResponse>>(
                API_PATHS.AUTH.LOGIN,
                values
            );
            login(response.data.user, response.data.token);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && <ErrorMessage message={error} />}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    error={errors.password?.message}
                />

                <Button type="submit" fullWidth isLoading={isLoading}>
                    Sign in
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-slate-600">Don't have an account? </span>
                <Link
                    to={ROUTES.SIGNUP}
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
};
