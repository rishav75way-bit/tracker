import React from 'react';

export const Loader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div className="flex justify-center items-center p-4">
            <div
                className={`${sizes[size]} animate-spin rounded-full border-primary-100 border-t-primary-600`}
                role="status"
            />
        </div>
    );
};
