import React from 'react';
import type { Expense } from '../../app/types';
import { Edit2, Trash2, Calendar, FileText } from 'lucide-react';

interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
    expenses,
    onEdit,
    onDelete,
}) => {
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(dateString));
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                <p className="text-slate-500">No expenses found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white shadow-sm border border-slate-200 rounded-lg">
            <ul className="divide-y divide-slate-100">
                {expenses.map((expense) => (
                    <li key={expense.id} className="hover:bg-slate-50 transition-colors">
                        <div className="px-6 py-4 flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-lg font-bold text-slate-900">
                                        {formatAmount(expense.amount)}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                        {expense.category}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(expense.date)}
                                    </span>
                                    {expense.note && (
                                        <span className="flex items-center gap-1 italic">
                                            <FileText className="h-3.5 w-3.5" />
                                            {expense.note}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => onEdit(expense)}
                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(expense.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
