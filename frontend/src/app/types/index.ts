export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Expense {
    id: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseSummary {
    total: number;
    count: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}
