const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  token?: string;
}

export async function api<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}

export function getFieldError(
  errors: { field: string; message: string }[] | undefined,
  field: string
): string | undefined {
  return errors?.find((e) => e.field === field)?.message;
}
