import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
        const widthStyle = fullWidth ? 'w-full' : '';

        return (
            <div className={`${widthStyle} mb-4`}>
                {label && (
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
