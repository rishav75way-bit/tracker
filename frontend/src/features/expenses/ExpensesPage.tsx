import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../app/api/client';
import { API_PATHS } from '../../shared/constants';
import type { ApiResponse, Expense, ExpenseSummary as IExpenseSummary } from '../../app/types';
import { ExpenseList } from './ExpenseList';
import { ExpenseForm } from './ExpenseForm';
import type { ExpenseFormValues } from './ExpenseForm';
import { ExpenseFilters } from './ExpenseFilters';
import { ExpenseSummary } from './ExpenseSummary';
import { ExpenseCharts } from './ExpenseCharts';
import { Button, Loader, ErrorMessage, Card, ConfirmModal, BudgetModal } from '../../shared/components';
import { Plus, X } from 'lucide-react';

interface Filters {
    category?: string;
    startDate?: string;
    endDate?: string;
}

export const ExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [summary, setSummary] = useState<IExpenseSummary>({ total: 0, count: 0 });
    const [budget, setBudget] = useState<number>(0);
    const [categoryStats, setCategoryStats] = useState<{ category: string; total: number }[]>([]);
    const [monthlyStats, setMonthlyStats] = useState<{ month: string; total: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

    const [filters, setFilters] = useState<Filters>({
        category: undefined,
        startDate: undefined,
        endDate: undefined,
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);

            if (filters.startDate) {
                const date = new Date(filters.startDate);
                date.setHours(0, 0, 0, 0);
                params.append('startDate', date.toISOString());
            }
            if (filters.endDate) {
                const date = new Date(filters.endDate);
                date.setHours(23, 59, 59, 999);
                params.append('endDate', date.toISOString());
            }

            const [expensesRes, summaryRes, categoryRes, monthlyRes, budgetRes] = await Promise.all([
                apiClient.get<unknown, ApiResponse<Expense[]>>(`${API_PATHS.EXPENSES.BASE}?${params.toString()}`),
                apiClient.get<unknown, ApiResponse<IExpenseSummary>>(`${API_PATHS.EXPENSES.SUMMARY}?${params.toString()}`),
                apiClient.get<unknown, ApiResponse<{ category: string; total: number }[]>>(`${API_PATHS.EXPENSES.STATS_CATEGORIES}?${params.toString()}`),
                apiClient.get<unknown, ApiResponse<{ month: string; total: number }[]>>(`${API_PATHS.EXPENSES.STATS_MONTHLY}`),
                apiClient.get<unknown, ApiResponse<number>>(`${API_PATHS.EXPENSES.BUDGET}?month=${currentMonth}`),
            ]);

            setExpenses(expensesRes.data);
            setSummary(summaryRes.data);
            setCategoryStats(categoryRes.data);
            setMonthlyStats(monthlyRes.data);
            setBudget(budgetRes.data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch data';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveBudget = async (limit: number) => {
        const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
        setIsActionLoading(true);
        try {
            await apiClient.post(API_PATHS.EXPENSES.BUDGET, {
                monthlyLimit: limit,
                month: currentMonth,
            });
            fetchData();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to set budget';
            setError(message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleAddOrUpdate = async (values: ExpenseFormValues) => {
        setIsActionLoading(true);
        try {
            if (editingExpense) {
                await apiClient.put(`${API_PATHS.EXPENSES.BASE}/${editingExpense.id}`, values);
            } else {
                await apiClient.post(API_PATHS.EXPENSES.BASE, values);
            }
            setShowForm(false);
            setEditingExpense(null);
            fetchData();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Operation failed';
            setError(message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!expenseToDelete) return;

        setIsActionLoading(true);
        try {
            await apiClient.delete(`${API_PATHS.EXPENSES.BASE}/${expenseToDelete}`);
            setIsDeleteModalOpen(false);
            setExpenseToDelete(null);
            fetchData();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Delete failed';
            setError(message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setExpenseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleEditInit = (expense: Expense) => {
        setEditingExpense(expense);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingExpense(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
                    <p className="text-slate-500">Track and manage your daily spending</p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Expense
                    </Button>
                )}
            </div>

            <ExpenseSummary
                total={summary.total}
                count={summary.count}
                budget={budget}
                onSetBudget={() => setIsBudgetModalOpen(true)}
            />

            {!showForm && !isLoading && expenses.length > 0 && (
                <ExpenseCharts categoryData={categoryStats} monthlyData={monthlyStats} />
            )}

            {showForm && (
                <Card
                    title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
                    headerAction={
                        <button onClick={handleCancelForm} className="text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    }
                    className="mb-8 border-primary-200 ring-1 ring-primary-100"
                >
                    <ExpenseForm
                        onSubmit={handleAddOrUpdate}
                        initialData={editingExpense || undefined}
                        isLoading={isActionLoading}
                        onCancel={handleCancelForm}
                    />
                </Card>
            )}

            <div className="space-y-4">
                <ExpenseFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onClear={() => setFilters({ category: undefined, startDate: undefined, endDate: undefined })}
                />

                {error && <ErrorMessage message={error} className="mb-4" />}

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader size="lg" />
                    </div>
                ) : (
                    <ExpenseList
                        expenses={expenses}
                        onEdit={handleEditInit}
                        onDelete={handleDeleteClick}
                    />
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
                confirmText="Delete"
                isLoading={isActionLoading}
            />

            <BudgetModal
                isOpen={isBudgetModalOpen}
                initialBudget={budget}
                onClose={() => setIsBudgetModalOpen(false)}
                onSave={handleSaveBudget}
                isLoading={isActionLoading}
            />
        </div>
    );
};
