/**
 * React Query hooks for Matrizador API
 *
 * Provides typed hooks for all API endpoints with caching and error handling.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, EstadisticasMatrizador, CupoDisponible, TramiteEstado, RegistrarTramiteData, Servicio } from '@/lib/api';

// Query Keys
export const queryKeys = {
  estadisticas: ['estadisticas', 'matrizador'] as const,
  cupo: ['cupo'] as const,
  misTramites: ['misTramites'] as const,
  favoritos: ['tramites', 'favoritos'] as const,
  popupData: (query?: string) => ['tramites', 'popup', query] as const,
};

/**
 * Hook for matrizador productivity statistics
 */
export function useEstadisticasMatrizador() {
  return useQuery<EstadisticasMatrizador>({
    queryKey: queryKeys.estadisticas,
    queryFn: () => api.flujo.estadisticasMatrizador(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Hook for cupo (quota) information
 */
export function useCupoDisponible() {
  return useQuery<CupoDisponible>({
    queryKey: queryKeys.cupo,
    queryFn: () => api.flujo.cupoDisponible(),
    refetchInterval: 60000, // Refresh every minute
  });
}

/**
 * Hook for matrizador's tramites
 */
export function useMisTramites() {
  return useQuery<TramiteEstado[]>({
    queryKey: queryKeys.misTramites,
    queryFn: () => api.flujo.misTramites(),
  });
}

/**
 * Hook for favorite tramites (services)
 */
export function useFavoritos() {
  return useQuery<Servicio[]>({
    queryKey: queryKeys.favoritos,
    queryFn: () => api.tramites.favoritos(),
  });
}

/**
 * Hook for tramite popup data (recents + favorites + search/categories)
 */
export function useTramitePopupData(query?: string) {
  return useQuery({
    queryKey: queryKeys.popupData(query),
    queryFn: () => api.tramites.popupData(query),
    staleTime: 5000, // 5 seconds cache
  });
}

/**
 * Mutation hook for registering a new tramite
 */
export function useRegistrarTramite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegistrarTramiteData) => api.flujo.registrar(data),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.estadisticas });
      queryClient.invalidateQueries({ queryKey: queryKeys.cupo });
      queryClient.invalidateQueries({ queryKey: queryKeys.misTramites });
    },
  });
}

/**
 * Mutation hook for completing a tramite (cajera action)
 */
export function useCompletarTramite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.flujo.completar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.estadisticas });
      queryClient.invalidateQueries({ queryKey: queryKeys.misTramites });
    },
  });
}

/**
 * Mutation hook for canceling a tramite
 */
export function useCancelarTramite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) =>
      api.flujo.cancelar(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.estadisticas });
      queryClient.invalidateQueries({ queryKey: queryKeys.cupo });
      queryClient.invalidateQueries({ queryKey: queryKeys.misTramites });
    },
  });
}

/**
 * Mutation hook for registering tramite usage
 */
export function useRegistrarUso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tramiteId: string) => api.tramites.registrarUso(tramiteId),
    onSuccess: () => {
      // Invalidate popup data to refresh recents
      queryClient.invalidateQueries({ queryKey: ['tramites', 'popup'] });
    },
  });
}
