import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, ErrorMessage } from '../../shared/components';
import { EXPENSE_CATEGORIES } from '../../shared/constants';
import type { Expense } from '../../app/types';

const expenseSchema = z.object({
    amount: z.number({ message: 'Amount must be a number' }).positive('Amount must be positive'),
    category: z.string().min(1, 'Category is required'),
    date: z.string().min(1, 'Date is required'),
    note: z.string().max(500, 'Note must not exceed 500 characters').optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
    onSubmit: (values: ExpenseFormValues) => Promise<void>;
    initialData?: Expense;
    isLoading?: boolean;
    onCancel?: () => void;
    error?: string | null;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
    onSubmit,
    initialData,
    isLoading,
    onCancel,
    error,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: initialData ? {
            amount: initialData.amount,
            category: initialData.category,
            date: new Date(initialData.date).toISOString().split('T')[0],
            note: initialData.note || '',
        } : {
            amount: undefined as unknown as number,
            date: new Date().toISOString().split('T')[0],
            note: '',
            category: '',
        },
    });

    const handleFormSubmit = async (values: ExpenseFormValues) => {
        const isoDate = new Date(values.date).toISOString();
        await onSubmit({ ...values, date: isoDate });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {error && <ErrorMessage message={error} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('amount', { valueAsNumber: true })}
                    error={errors.amount?.message}
                />

                <Select
                    label="Category"
                    options={EXPENSE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                    {...register('category')}
                    error={errors.category?.message}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Date"
                    type="date"
                    {...register('date')}
                    error={errors.date?.message}
                />

                <Input
                    label="Note (Optional)"
                    placeholder="What was this for?"
                    {...register('note')}
                    error={errors.note?.message}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? 'Update Expense' : 'Add Expense'}
                </Button>
            </div>
        </form>
    );
};
