// Validation utilities

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function isValidPassword(password: string): boolean {
    return password.length >= 6;
}

export function isStrongPassword(password: string): boolean {
    return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password)
    );
}

export function validateRequired(value: string | number | undefined | null): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
}

export function validateMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
}

export function validateMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
}

export function validateRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}
