import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '../../shared/layouts/AuthLayout';
import { AppLayout } from '../../shared/layouts/AppLayout';
import { ROUTES } from '../../shared/constants';
import { Loader } from '../../shared/components';

const LoginPage = lazy(() => import('../../features/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('../../features/auth/SignupPage').then(module => ({ default: module.SignupPage })));
const ExpensesPage = lazy(() => import('../../features/expenses/ExpensesPage').then(module => ({ default: module.ExpensesPage })));

const SuspenseLoader = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
    </div>
);

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: (
                    <Suspense fallback={<SuspenseLoader />}>
                        <LoginPage />
                    </Suspense>
                ),
            },
            {
                path: ROUTES.SIGNUP,
                element: (
                    <Suspense fallback={<SuspenseLoader />}>
                        <SignupPage />
                    </Suspense>
                ),
            },
        ],
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: ROUTES.DASHBOARD,
                element: (
                    <Suspense fallback={<SuspenseLoader />}>
                        <ExpensesPage />
                    </Suspense>
                ),
            },
        ],
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
