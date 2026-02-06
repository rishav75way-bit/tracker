import mongoose from 'mongoose';
import { Expense, IExpense } from './expense.model';
import { Budget } from './budget.model';
import {
    CreateExpenseInput,
    UpdateExpenseInput,
    GetExpensesQuery,
} from './expense.validator';
import { SetBudgetInput } from './budget.validator';
import { AppError } from '../../common/middleware';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../common/utils';

interface ExpenseResponse {
    id: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

interface ExpenseSummary {
    total: number;
    count: number;
}

const formatExpense = (expense: IExpense): ExpenseResponse => ({
    id: expense._id.toString(),
    amount: expense.amount,
    category: expense.category,
    date: expense.date.toISOString(),
    note: expense.note,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
});

interface DateFilter {
    $gte?: Date;
    $lte?: Date;
}

const buildExpenseFilter = (userId: string, query: GetExpensesQuery): Record<string, unknown> => {
    const filter: Record<string, unknown> = { userId };

    if (query.category) {
        filter.category = query.category;
    }

    if (query.startDate || query.endDate) {
        const dateFilter: DateFilter = {};
        if (query.startDate) {
            dateFilter.$gte = new Date(query.startDate);
        }
        if (query.endDate) {
            dateFilter.$lte = new Date(query.endDate);
        }
        filter.date = dateFilter;
    }

    return filter;
};

export const expenseService = {
    create: async (userId: string, input: CreateExpenseInput): Promise<ExpenseResponse> => {
        const expense = await Expense.create({
            userId,
            amount: input.amount,
            category: input.category,
            date: new Date(input.date),
            note: input.note,
        });

        return formatExpense(expense);
    },

    getAll: async (userId: string, query: GetExpensesQuery): Promise<ExpenseResponse[]> => {
        const filter = buildExpenseFilter(userId, query);
        const expenses = await Expense.find(filter).sort({ date: -1 });
        return expenses.map(formatExpense);
    },

    getById: async (userId: string, expenseId: string): Promise<ExpenseResponse> => {
        const expense = await Expense.findOne({ _id: expenseId, userId });

        if (!expense) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.EXPENSE_NOT_FOUND);
        }

        return formatExpense(expense);
    },

    update: async (
        userId: string,
        expenseId: string,
        input: UpdateExpenseInput
    ): Promise<ExpenseResponse> => {
        const expense = await Expense.findOne({ _id: expenseId, userId });

        if (!expense) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.EXPENSE_NOT_FOUND);
        }

        if (input.amount !== undefined) {
            expense.amount = input.amount;
        }
        if (input.category !== undefined) {
            expense.category = input.category;
        }
        if (input.date !== undefined) {
            expense.date = new Date(input.date);
        }
        if (input.note !== undefined) {
            expense.note = input.note;
        }

        await expense.save();
        return formatExpense(expense);
    },

    delete: async (userId: string, expenseId: string): Promise<void> => {
        const result = await Expense.deleteOne({ _id: expenseId, userId });

        if (result.deletedCount === 0) {
            throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.EXPENSE_NOT_FOUND);
        }
    },

    getSummary: async (userId: string, query: GetExpensesQuery): Promise<ExpenseSummary> => {
        const filter = buildExpenseFilter(userId, query);
        const expenses = await Expense.find(filter);
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        return {
            total,
            count: expenses.length,
        };
    },
    getCategoryStats: async (userId: string, query: GetExpensesQuery): Promise<{ category: string; total: number }[]> => {
        const filter = buildExpenseFilter(userId, query);
        const matchFilter = { ...filter, userId: new mongoose.Types.ObjectId(userId) };

        const stats = await Expense.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    total: 1,
                },
            },
            { $sort: { total: -1 } },
        ]);

        return stats;
    },

    getMonthlyStats: async (userId: string): Promise<{ month: string; total: number }[]> => {
        const stats = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                    },
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            { $cond: { if: { $lt: ['$_id.month', 10] }, then: '0', else: '' } },
                            { $toString: '$_id.month' },
                        ],
                    },
                    total: 1,
                },
            },
            { $limit: 6 },
        ]);

        return stats;
    },

    getBudget: async (userId: string, month: string): Promise<number> => {
        const budget = await Budget.findOne({ userId: new mongoose.Types.ObjectId(userId), month });
        return budget ? budget.monthlyLimit : 0;
    },

    setBudget: async (userId: string, input: SetBudgetInput): Promise<number> => {
        const budget = await Budget.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), month: input.month },
            { monthlyLimit: input.monthlyLimit },
            { upsert: true, new: true }
        );
        return budget.monthlyLimit;
    },
};
