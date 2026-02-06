export const EXPENSE_CATEGORIES = [
    'Food',
    'Travel',
    'Rent',
    'Shopping',
    'Other',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    INVALID_TOKEN: 'Invalid or expired token',
    EXPENSE_NOT_FOUND: 'Expense not found',
    FORBIDDEN: 'You do not have permission to perform this action',
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;
