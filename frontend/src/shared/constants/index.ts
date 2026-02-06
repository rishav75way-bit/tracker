export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/',
    SETTINGS: '/settings',
} as const;

export const API_PATHS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },
    EXPENSES: {
        BASE: '/expenses',
        SUMMARY: '/expenses/summary',
        STATS_CATEGORIES: '/expenses/stats/categories',
        STATS_MONTHLY: '/expenses/stats/monthly',
        BUDGET: '/expenses/budget',
    },
} as const;

export const EXPENSE_CATEGORIES = [
    { value: 'Food', label: 'Food' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Rent', label: 'Rent' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Other', label: 'Other' },
] as const;

export const STORAGE_KEYS = {
    TOKEN: 'expense_tracker_token',
    USER: 'expense_tracker_user',
} as const;
