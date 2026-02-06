import mongoose, { Document, Schema } from 'mongoose';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '../../common/utils';

export interface IExpense extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    category: ExpenseCategory;
    date: Date;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            enum: EXPENSE_CATEGORIES,
        },
        date: {
            type: Date,
            required: true,
        },
        note: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
