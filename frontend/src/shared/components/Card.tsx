import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', headerAction }) => {
    return (
        <div className={`bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden ${className}`}>
            {(title || headerAction) && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="px-6 py-4">
                {children}
            </div>
        </div>
    );
};
