const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface FetchOptions extends RequestInit {
    _isRetry?: boolean;
}

let activeRefreshPromise: Promise<void> | null = null;

const refreshToken = async (): Promise<void> => {
    const baseUrl = API_BASE_URL.replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/v1/refresh`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Refresh failed");
};

export const fetchWithConfig = async <T = unknown>(
    endpoint: string,
    options: FetchOptions = {},
    timeoutMs = 10000,
): Promise<T> => {
    const { _isRetry, ...fetchOptions } = options;
    const baseUrl = API_BASE_URL.replace(/\/$/, "");
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${path}`;

    const isFormData = fetchOptions.body instanceof FormData;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
            credentials: "include",
            headers: isFormData
                ? fetchOptions.headers
                : {
                    "Content-Type": "application/json",
                    ...fetchOptions.headers,
                },
        });

        if (response.status === 401 && !_isRetry) {
            clearTimeout(timeout);

            try {
                if (!activeRefreshPromise) {
                    activeRefreshPromise = refreshToken();
                }

                await activeRefreshPromise;

                activeRefreshPromise = null;

                return await fetchWithConfig(endpoint, { ...options, _isRetry: true });
            } catch {
                activeRefreshPromise = null;
                throw new Error("Sessão expirada");
            }
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        if (response.status === 204) return null as T;

        return (await response.json()) as T;
    } finally {
        clearTimeout(timeout);
    }
};
