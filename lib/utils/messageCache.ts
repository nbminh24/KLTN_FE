import { ChatMessage } from '@/lib/types/chat';

const CACHE_KEY_PREFIX = 'chat_messages_';
const CACHE_VERSION = 'v1';
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedSession {
    version: string;
    sessionId: number;
    messages: ChatMessage[];
    timestamp: number;
}

export const messageCache = {
    save: (sessionId: number, messages: ChatMessage[]) => {
        try {
            const cacheData: CachedSession = {
                version: CACHE_VERSION,
                sessionId,
                messages: messages.map(msg => ({
                    ...msg,
                    timestamp: msg.timestamp.toISOString() as any,
                })),
                timestamp: Date.now(),
            };

            const key = `${CACHE_KEY_PREFIX}${sessionId}`;
            localStorage.setItem(key, JSON.stringify(cacheData));

            console.log(`[MessageCache] ✅ Cached ${messages.length} messages for session ${sessionId}`);
        } catch (error) {
            console.error('[MessageCache] Failed to save cache:', error);
        }
    },

    load: (sessionId: number): ChatMessage[] | null => {
        try {
            const key = `${CACHE_KEY_PREFIX}${sessionId}`;
            const cached = localStorage.getItem(key);

            if (!cached) {
                console.log(`[MessageCache] No cache found for session ${sessionId}`);
                return null;
            }

            const data: CachedSession = JSON.parse(cached);

            if (data.version !== CACHE_VERSION) {
                console.log('[MessageCache] Cache version mismatch, ignoring');
                localStorage.removeItem(key);
                return null;
            }

            const age = Date.now() - data.timestamp;
            if (age > MAX_CACHE_AGE_MS) {
                console.log('[MessageCache] Cache expired, removing');
                localStorage.removeItem(key);
                return null;
            }

            const messages: ChatMessage[] = data.messages.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp as any),
            }));

            console.log(`[MessageCache] ✅ Loaded ${messages.length} messages from cache`);
            return messages;
        } catch (error) {
            console.error('[MessageCache] Failed to load cache:', error);
            return null;
        }
    },

    clear: (sessionId: number) => {
        try {
            const key = `${CACHE_KEY_PREFIX}${sessionId}`;
            localStorage.removeItem(key);
            console.log(`[MessageCache] Cleared cache for session ${sessionId}`);
        } catch (error) {
            console.error('[MessageCache] Failed to clear cache:', error);
        }
    },

    clearAll: () => {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(CACHE_KEY_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('[MessageCache] Cleared all cached messages');
        } catch (error) {
            console.error('[MessageCache] Failed to clear all cache:', error);
        }
    },
};
