import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../app/config/AuthContext';
import { ROUTES } from '../../shared/constants';
import { LogOut, LayoutDashboard, Wallet } from 'lucide-react';

export const AppLayout: React.FC = () => {
    const { isAuthenticated, isLoading, logout, user } = useAuth();

    if (isLoading) return null;
    if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to={ROUTES.DASHBOARD} className="flex-shrink-0 flex items-center gap-2 font-bold text-primary-600 text-xl">
                                <Wallet className="h-6 w-6" />
                                <span>Tracker</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex sm:items-center sm:gap-4 text-sm text-slate-600">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="font-medium">{user?.email}</span>
                            </div>

                            <button
                                onClick={logout}
                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>

            <footer className="mt-auto py-8 text-center text-sm text-slate-400 border-t border-slate-200 bg-white">
                <p> 2026 Expense Tracker Practice Project</p>
            </footer>
        </div>
    );
};
