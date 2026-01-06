// Cache utilities for config data
const CACHE_KEY = 'growkub_config_cache';
const CACHE_TIMESTAMP_KEY = 'growkub_config_timestamp';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export function getCachedConfig() {
    if (typeof window === 'undefined') return null;

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

        if (!cached || !timestamp) return null;

        const age = Date.now() - parseInt(timestamp);
        if (age > CACHE_DURATION) {
            // Cache expired
            clearConfigCache();
            return null;
        }

        return JSON.parse(cached);
    } catch (err) {
        console.error('Cache read error:', err);
        return null;
    }
}

export function setCachedConfig(config: any) {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(config));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
        console.error('Cache write error:', err);
    }
}

export function clearConfigCache() {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (err) {
        console.error('Cache clear error:', err);
    }
}
