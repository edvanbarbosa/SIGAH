// =============================================================================
// lib/api/client.ts
// Cliente HTTP genérico integrado com o fetch nativo do Next.js.
// Gerencia a injeção do token JWT e formata as respostas de erro da API.
// =============================================================================

import { ApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Recupera o token de autenticação JWT guardado localmente (se executado no navegador).
 */
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sigah_token");
  }
  return null;
}

/**
 * Lida com respostas de falha do servidor e formata a resposta seguindo o tipo ApiError.
 */
async function handleResponseError(response: Response): Promise<never> {
  let apiError: ApiError;
  try {
    const errorData = await response.json();
    apiError = {
      success: false,
      message: errorData.message || "Erro desconhecido retornado pela API",
      statusCode: response.status,
      errorCode: errorData.errorCode || "API_ERROR",
      fieldErrors: errorData.fieldErrors || null,
      timestamp: errorData.timestamp || new Date().toISOString(),
    };
  } catch {
    apiError = {
      success: false,
      message: response.statusText || "Falha na comunicação com o servidor",
      statusCode: response.status,
      errorCode: "HTTP_ERROR",
      fieldErrors: null,
      timestamp: new Date().toISOString(),
    };
  }
  throw apiError;
}

/**
 * Utilitários do cliente HTTP para chamadas REST.
 */
export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      return handleResponseError(response);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const result = await response.json();
    // Desembrulha o padrão de resposta do backend se contido no campo 'data'
    return result.data !== undefined ? result.data : result;
  },

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
