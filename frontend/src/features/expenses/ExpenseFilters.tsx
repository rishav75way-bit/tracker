import React from 'react';
import { Select, Input } from '../../shared/components';
import { EXPENSE_CATEGORIES } from '../../shared/constants';
import { Filter, X } from 'lucide-react';

interface Filters {
    category?: string;
    startDate?: string;
    endDate?: string;
}

interface ExpenseFiltersProps {
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    onClear: () => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
    filters,
    onFilterChange,
    onClear,
}) => {
    const handleChange = (field: keyof Filters, value: string) => {
        onFilterChange({ ...filters, [field]: value || undefined });
    };

    const hasFilters = !!(filters.category || filters.startDate || filters.endDate);

    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {hasFilters && (
                    <button
                        onClick={onClear}
                        className="ml-auto flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        <X className="h-3 w-3" />
                        Clear all
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    label="Category"
                    options={EXPENSE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                    value={filters.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="mb-0"
                />

                <Input
                    label="From"
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="mb-0"
                />

                <Input
                    label="To"
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="mb-0"
                />
            </div>
        </div>
    );
};
