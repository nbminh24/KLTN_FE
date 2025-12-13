'use client';

import { useEffect } from 'react';
import { startTokenRefreshChecker } from '@/lib/utils/tokenRefresh';

export default function TokenRefreshProvider() {
    useEffect(() => {
        // Start token refresh checker
        const cleanup = startTokenRefreshChecker();

        // Cleanup on unmount
        return cleanup;
    }, []);

    return null; // This component doesn't render anything
}
