// Simple in-memory cache with TTL
const store = new Map();

function _now() {
    return Date.now();
}

/**
 * Set a value in cache
 * @param {string} key
 * @param {*} value
 * @param {number} ttlMs
 */
function set(key, value, ttlMs = 600000) { // default 10 minutes
    const expiresAt = _now() + ttlMs;
    store.set(key, { value, expiresAt });
}

/**
 * Get value from cache or undefined if missing/expired
 * @param {string} key
 */
function get(key) {
    const item = store.get(key);
    if (!item) return undefined;
    if (item.expiresAt <= _now()) {
        store.delete(key);
        return undefined;
    }
    return item.value;
}

/**
 * Delete a cache key
 * @param {string} key
 */
function del(key) {
    return store.delete(key);
}

/**
 * Clear cache for keys starting with user prefix
 * @param {string} userId
 */
function clearUser(userId) {
    const prefix = `${userId}:`;
    for (const key of Array.from(store.keys())) {
        if (key.startsWith(prefix)) {
            store.delete(key);
        }
    }
}

/**
 * Clear all cache (useful for tests)
 */
function clearAll() {
    store.clear();
}

module.exports = {
    set,
    get,
    del,
    clearUser,
    clearAll
};
