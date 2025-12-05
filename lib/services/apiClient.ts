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
            // Check if request is for admin API
            const isAdminRequest = config.url?.includes('/admin/');
            const token = isAdminRequest
                ? localStorage.getItem('admin_access_token')
                : localStorage.getItem('access_token');

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

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response Interceptor - Global Error Handling
apiClient.interceptors.response.use(
    (response) => {
        // Return successful response
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                const isAdminPath = currentPath.startsWith('/admin');

                // Don't try to refresh on login/register pages
                if (currentPath.includes('/login') || currentPath.includes('/register') ||
                    currentPath.includes('/admin-login')) {
                    return Promise.reject(error);
                }

                // Try to refresh token
                if (!isAdminPath) {
                    const refreshToken = localStorage.getItem('refresh_token');

                    if (refreshToken && !isRefreshing) {
                        isRefreshing = true;
                        originalRequest._retry = true;

                        try {
                            // Call refresh token endpoint
                            const response = await axios.post(
                                `${API_BASE_URL}/api/v1/auth/refresh`,
                                { refresh_token: refreshToken }
                            );

                            const newAccessToken = response.data.access_token;
                            localStorage.setItem('access_token', newAccessToken);

                            // Update authorization header
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            }

                            isRefreshing = false;
                            processQueue(null, newAccessToken);

                            // Retry original request
                            return apiClient(originalRequest);
                        } catch (refreshError) {
                            isRefreshing = false;
                            processQueue(refreshError, null);

                            // Refresh failed - clear auth and redirect
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            localStorage.removeItem('user');
                            window.location.href = '/login?session_expired=true';

                            return Promise.reject(refreshError);
                        }
                    } else if (isRefreshing) {
                        // Queue requests while refreshing
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        }).then(token => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            return apiClient(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    } else {
                        // No refresh token - clear and redirect
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        window.location.href = '/login?session_expired=true';
                    }
                } else {
                    // Admin path - clear admin auth
                    localStorage.removeItem('admin_access_token');
                    localStorage.removeItem('admin');

                    if (!currentPath.includes('/admin-login')) {
                        window.location.href = '/admin-login?session_expired=true';
                    }
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
                const isAdminRequest = config.url?.includes('/admin/');
                const token = isAdminRequest
                    ? localStorage.getItem('admin_access_token')
                    : localStorage.getItem('access_token');
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
                const currentPath = window.location.pathname;
                const isAdminPath = currentPath.startsWith('/admin');

                if (isAdminPath) {
                    localStorage.removeItem('admin_access_token');
                    localStorage.removeItem('admin');
                    if (!currentPath.includes('/admin-login')) {
                        window.location.href = '/admin-login?session_expired=true';
                    }
                } else {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                        window.location.href = '/login?session_expired=true';
                    }
                }
            }
            return Promise.reject(error);
        }
    );

    return formDataClient;
};
