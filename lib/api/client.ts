import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL from environment or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request Interceptor - Attach Authorization Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (only in browser)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Global Error Handling
apiClient.interceptors.response.use(
    (response) => {
        // Return successful response
        return response;
    },
    (error: AxiosError) => {
        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
            // Clear auth data
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');

                // Redirect to login page
                // Only redirect if not already on auth pages
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                    window.location.href = '/login?session_expired=true';
                }
            }
        }

        // Handle 403 Forbidden - Insufficient permissions
        if (error.response?.status === 403) {
            console.error('Access forbidden - insufficient permissions');
        }

        // Handle 404 Not Found
        if (error.response?.status === 404) {
            console.error('Resource not found');
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            console.error('Server error - please try again later');
        }

        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default apiClient;

// Export helper for multipart/form-data requests
export const createFormDataClient = (): AxiosInstance => {
    const formDataClient = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
    });

    // Add same interceptors
    formDataClient.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('access_token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    formDataClient.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response?.status === 401 && typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                    window.location.href = '/login?session_expired=true';
                }
            }
            return Promise.reject(error);
        }
    );

    return formDataClient;
};
