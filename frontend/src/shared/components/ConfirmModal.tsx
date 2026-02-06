import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    type = 'danger',
    isLoading = false,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant={type === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full flex-shrink-0 ${type === 'danger' ? 'bg-red-50 text-red-600' :
                        type === 'warning' ? 'bg-amber-50 text-amber-600' :
                            'bg-primary-50 text-primary-600'
                    }`}>
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-slate-600">{message}</p>
                </div>
            </div>
        </Modal>
    );
};
