/**
 * API Client for FIDES Management Suite - Matrizador External
 *
 * Handles all HTTP requests to the Django backend with JWT authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'fides_access_token';
const REFRESH_TOKEN_KEY = 'fides_refresh_token';

// Token management
export const TokenService = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: () => !!localStorage.getItem(ACCESS_TOKEN_KEY),
};

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export interface TramiteEstado {
  id: string;
  fecha: string;
  cliente: string;
  tramite: string;
  estado: 'pendiente' | 'facturado' | 'completado' | 'reconciliado' | 'cancelado';
  escritura_no?: string;
}

export interface DistribucionLibro {
  libro: string;
  codigo: string;
  count: number;
}

export interface EstadisticasMatrizador {
  registrados_hoy: number;
  pendientes: number;
  completados_hoy: number;
  total_mes: number;
  porcentaje_completados: number;
  distribucion_libros: DistribucionLibro[];
  top_categoria: DistribucionLibro | null;
  tramites_recientes: TramiteEstado[];
  cupo_estado: 'disponible' | 'alerta' | 'critico' | 'bloqueado';
  user_name: string;
}

export interface CupoDisponible {
  total_mes: number;
  limite_mensual: number | null;
  cupo_disponible: number | null;
  puede_registrar: boolean;
  porcentaje_usado: number;
  pendientes_count: number;
  pendientes_total: number;
}

export interface Servicio {
  id: string;
  codigo: string;
  nombre: string;
  categoria: {
    id: string;
    codigo: string;
    nombre: string;
  };
  precio_mediana?: number;
}

export interface RegistrarTramiteData {
  tramite?: string; // UUID del servicio
  concepto?: string;
  nombre_cliente: string;
  cedula_cliente: string;
  telefono?: string;
  notas?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public data: Record<string, unknown>,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fetch wrapper with auth
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = TokenService.getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && TokenService.getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      (headers as Record<string, string>)['Authorization'] = `Bearer ${TokenService.getAccessToken()}`;
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      // Refresh failed, clear tokens and redirect to login
      TokenService.clearTokens();
      window.location.href = '/login';
    }
  }

  return response;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = TokenService.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      TokenService.setTokens(data.access, refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// API helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(endpoint, options);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      data,
      data.error || data.detail || `HTTP ${response.status}`
    );
  }

  return response.json();
}

// API endpoints
export const api = {
  // Authentication
  auth: {
    login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
      const response = await fetch(`${API_BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          data,
          data.detail || 'Credenciales incorrectas'
        );
      }

      const tokens = await response.json();
      TokenService.setTokens(tokens.access, tokens.refresh);
      return tokens;
    },

    logout: () => {
      TokenService.clearTokens();
    },

    getMe: () => apiRequest<User>('/auth/me/'),
  },

  // Flujo Matrizador-Cajera
  flujo: {
    registrar: (data: RegistrarTramiteData) =>
      apiRequest<TramiteEstado>('/ingresos/flujo/registrar/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    misTramites: () =>
      apiRequest<TramiteEstado[]>('/ingresos/flujo/mis-tramites/'),

    detalle: (id: string) =>
      apiRequest<TramiteEstado>(`/ingresos/flujo/${id}/`),

    completar: (id: string) =>
      apiRequest<TramiteEstado>(`/ingresos/flujo/${id}/completar/`, {
        method: 'POST',
      }),

    cancelar: (id: string, motivo: string) =>
      apiRequest<TramiteEstado>(`/ingresos/flujo/${id}/cancelar/`, {
        method: 'POST',
        body: JSON.stringify({ motivo_cancelacion: motivo }),
      }),

    cupoDisponible: () =>
      apiRequest<CupoDisponible>('/ingresos/flujo/cupo-disponible/'),

    estadisticasMatrizador: () =>
      apiRequest<EstadisticasMatrizador>('/ingresos/flujo/estadisticas/matrizador/'),
  },

  // Tramites/Servicios
  tramites: {
    search: (query: string, categoria?: string) =>
      apiRequest<{ results: Servicio[] }>(
        `/tramites/search/?q=${encodeURIComponent(query)}${categoria ? `&categoria=${categoria}` : ''}`
      ),

    favoritos: () =>
      apiRequest<Servicio[]>('/tramites/favoritos/'),

    recientes: () =>
      apiRequest<Servicio[]>('/tramites/recientes/'),

    porCategoria: () =>
      apiRequest<Record<string, Servicio[]>>('/tramites/por-categoria/'),

    popupData: (query?: string) =>
      apiRequest<{
        recientes: Servicio[];
        favoritos: Servicio[];
        resultados?: Servicio[];
        categorias?: Record<string, Servicio[]>;
        modo: 'busqueda' | 'categorias';
      }>(`/tramites/popup-data/${query ? `?q=${encodeURIComponent(query)}` : ''}`),

    registrarUso: (tramiteId: string) =>
      apiRequest<{ success: boolean }>('/tramites/registrar-uso/', {
        method: 'POST',
        body: JSON.stringify({ tramite_id: tramiteId }),
      }),
  },
};

export default api;
