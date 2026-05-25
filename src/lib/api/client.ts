type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

export async function api<T = unknown>(url: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || `Error ${res.status}` };
    }

    return { success: true, data: data as T };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error de conexión" };
  }
}

export const apiClient = {
  get: <T>(url: string) => api<T>(url),
  post: <T>(url: string, body?: unknown) => api<T>(url, { method: "POST", body }),
  put: <T>(url: string, body?: unknown) => api<T>(url, { method: "PUT", body }),
  del: <T>(url: string) => api<T>(url, { method: "DELETE" }),
};
