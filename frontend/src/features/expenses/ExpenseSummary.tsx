import React from 'react';
import { Card } from '../../shared/components';
import { DollarSign, PieChart, Target, Edit } from 'lucide-react';

interface ExpenseSummaryProps {
    total: number;
    count: number;
    budget: number;
    onSetBudget: () => void;
    isLoading?: boolean;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
    total,
    count,
    budget,
    onSetBudget,
}) => {
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const budgetPercent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
    const isOverBudget = total > budget && budget > 0;

    const getProgressColor = () => {
        if (budgetPercent >= 100) return 'bg-red-500';
        if (budgetPercent >= 80) return 'bg-amber-500';
        return 'bg-primary-500';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="!p-0 border-l-4 border-primary-500">
                <div className="flex items-center gap-4 p-5">
                    <div className="p-2.5 bg-primary-50 text-primary-600 rounded-lg">
                        <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent</p>
                        <p className="text-xl font-bold text-slate-900">{formatAmount(total)}</p>
                    </div>
                </div>
            </Card>

            <Card className="!p-0 border-l-4 border-emerald-500">
                <div className="flex items-center gap-4 p-5">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <PieChart className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transactions</p>
                        <p className="text-xl font-bold text-slate-900">{count}</p>
                    </div>
                </div>
            </Card>

            <Card className="!p-0 border-l-4 border-amber-500">
                <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Budget</p>
                                <p className="text-xl font-bold text-slate-900">{budget > 0 ? formatAmount(budget) : 'Not Set'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onSetBudget}
                            className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                            title="Set Budget"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                    </div>

                    {budget > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                <span className={isOverBudget ? 'text-red-500' : 'text-slate-500'}>
                                    {budgetPercent.toFixed(0)}% Utilized
                                </span>
                                <span className="text-slate-400">
                                    {formatAmount(budget - total)} {total > budget ? 'Over' : 'Left'}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${getProgressColor()}`}
                                    style={{ width: `${budgetPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
