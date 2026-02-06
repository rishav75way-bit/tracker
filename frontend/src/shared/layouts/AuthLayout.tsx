import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../app/config/AuthContext';
import { ROUTES } from '../../shared/constants';

export const AuthLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null;
    if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Expense Tracker
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Manage your expenses with style
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
