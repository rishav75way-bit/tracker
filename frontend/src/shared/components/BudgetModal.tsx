import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Target } from 'lucide-react';

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (amount: number) => Promise<void>;
    initialBudget: number;
    isLoading?: boolean;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialBudget,
    isLoading = false,
}) => {
    const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setAmount(initialBudget > 0 ? initialBudget.toString() : '');
        }
    }, [isOpen, initialBudget]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 0) return;

        await onSave(numAmount);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Set Monthly Budget"
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="budget-form"
                        isLoading={isLoading}
                        disabled={!amount || isNaN(parseFloat(amount))}
                    >
                        Save Budget
                    </Button>
                </>
            }
        >
            <form id="budget-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center gap-3 text-center mb-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                        <Target className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">
                            Set a monthly spending limit to track your financial goals.
                        </p>
                    </div>
                </div>

                <Input
                    label="Monthly Limit"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    autoFocus
                />
            </form>
        </Modal>
    );
};
