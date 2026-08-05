const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path: string) {
  if (path.startsWith("/")) return `${DEFAULT_API_URL}${path}`;
  return `${DEFAULT_API_URL}/${path}`;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = buildUrl(path);
  const headers: Record<string, string> = { Accept: "application/json" };
  const opts: RequestInit = { method, headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  // No content (204) — return undefined
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    // some servers send application/json with empty body on 204 — guard against empty text
    const txt = await res.text();
    if (!txt) return undefined as T;
    return JSON.parse(txt) as T;
  }
  // @ts-ignore
  return (await res.text()) as T;
}

export const api = {
  get: <T = any>(path: string) => request<T>("GET", path),
  post: <T = any>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T = any>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T = any>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T = any>(path: string) => request<T>("DELETE", path),
};

export default api;
