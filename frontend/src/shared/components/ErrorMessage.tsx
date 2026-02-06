import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
    if (!message) return null;

    return (
        <div className={`p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-red-700 text-sm ${className}`}>
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
};
