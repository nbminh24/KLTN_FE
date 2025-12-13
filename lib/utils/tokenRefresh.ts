import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Decode JWT to check expiry (without verification)
const decodeJWT = (token: string): { exp: number } | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// Check if token will expire soon (within 2 minutes)
export const tokenWillExpireSoon = (token: string): boolean => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return false;

    const now = Date.now() / 1000; // Current time in seconds
    const timeUntilExpiry = decoded.exp - now;

    // Refresh if less than 2 minutes remaining
    return timeUntilExpiry < 120;
};

// Refresh access token using refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            console.warn('[TokenRefresh] No refresh token available');
            return null;
        }

        console.log('[TokenRefresh] Refreshing access token...');
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            { refresh_token: refreshToken }
        );

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        // Update tokens in localStorage
        localStorage.setItem('access_token', newAccessToken);
        if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
        }

        console.log('[TokenRefresh] ✅ Token refreshed successfully');
        return newAccessToken;
    } catch (error) {
        console.error('[TokenRefresh] ❌ Failed to refresh token:', error);

        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        return null;
    }
};

// Start proactive token refresh checker
export const startTokenRefreshChecker = () => {
    // Check every 1 minute
    const intervalId = setInterval(async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            console.log('[TokenRefresh] No access token, skipping check');
            return;
        }

        if (tokenWillExpireSoon(accessToken)) {
            console.log('[TokenRefresh] Token will expire soon, refreshing...');
            const newToken = await refreshAccessToken();

            if (!newToken) {
                console.warn('[TokenRefresh] Failed to refresh, user may need to login again');
                // Optionally redirect to login
                // window.location.href = '/login?session_expired=true';
            }
        }
    }, 60 * 1000); // Check every 1 minute

    // Return cleanup function
    return () => clearInterval(intervalId);
};
