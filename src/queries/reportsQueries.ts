import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

// ============================================
// QUERY KEYS - Para gestión de caché
// ============================================
export const reportKeys = {
  all: ['reports'] as const,
  pipes: () => [...reportKeys.all, 'pipes'] as const,
  pipesBySector: (idSector: number) => [...reportKeys.pipes(), 'by-sector', idSector] as const,
  pipeInterventions: (idPipes: number, dateStart: string, dateFinish: string) =>
    [...reportKeys.pipes(), 'interventions', idPipes, dateStart, dateFinish] as const,
  connections: () => [...reportKeys.all, 'connections'] as const,
  connectionInterventions: (idConnection: number, dateStart: string, dateFinish: string) =>
    [...reportKeys.connections(), 'interventions', idConnection, dateStart, dateFinish] as const,
  sectors: () => [...reportKeys.all, 'sectors'] as const,
  sectorComparative: () => [...reportKeys.sectors(), 'comparative'] as const,
  interventions: () => [...reportKeys.all, 'interventions'] as const,
  interventionsGeneral: (dateStart: string, dateFinish: string) =>
    [...reportKeys.interventions(), 'general', dateStart, dateFinish] as const,
  interventionsBySector: (idSector: number, dateStart: string, dateFinish: string) =>
    [...reportKeys.interventions(), 'by-sector', idSector, dateStart, dateFinish] as const,
  interventionFrequency: (dateStart: string, dateFinish: string) =>
    [...reportKeys.interventions(), 'frequency', dateStart, dateFinish] as const,
  tanks: () => [...reportKeys.all, 'tanks'] as const,
  tankStatus: () => [...reportKeys.tanks(), 'status'] as const,
  deviations: () => [...reportKeys.all, 'deviations'] as const,
  assignments: () => [...reportKeys.all, 'assignments'] as const,
  assignmentsReport: (dateStart: string, dateFinish: string) =>
    [...reportKeys.assignments(), dateStart, dateFinish] as const,
  assignmentsByStatus: (dateStart: string, dateFinish: string) =>
    [...reportKeys.assignments(), 'by-status', dateStart, dateFinish] as const,
  employees: () => [...reportKeys.all, 'employees'] as const,
  plumberReport: (employeeId: number, dateStart: string, dateFinish: string) =>
    [...reportKeys.employees(), 'plumber', employeeId, dateStart, dateFinish] as const,
  topPlumbers: (dateStart: string, dateFinish: string) =>
    [...reportKeys.employees(), 'plumbers', 'top', dateStart, dateFinish] as const,
  operatorReport: (employeeId: number, dateStart: string, dateFinish: string) =>
    [...reportKeys.employees(), 'operator', employeeId, dateStart, dateFinish] as const,
  topOperators: (dateStart: string, dateFinish: string) =>
    [...reportKeys.employees(), 'operators', 'top', dateStart, dateFinish] as const,
  readers: (dateStart: string, dateFinish: string) =>
    [...reportKeys.employees(), 'readers', dateStart, dateFinish] as const,
  topReaders: (dateStart: string, dateFinish: string) =>
    [...reportKeys.employees(), 'readers', 'top', dateStart, dateFinish] as const,
  cleaners: () => [...reportKeys.employees(), 'cleaners'] as const,
  topCleaners: (dateStart: string, dateFinish: string) =>
    [...reportKeys.employees(), 'cleaners', 'top', dateStart, dateFinish] as const,
};

// ============================================
// REACT QUERY HOOKS
// ============================================

/**
 * Hook para obtener reporte de tuberías por sector
 */
export function usePipesBySector(idSector: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.pipesBySector(idSector!),
    queryFn: () => apiService.getPipesBySector(idSector!),
    enabled: (options?.enabled !== undefined ? options.enabled : idSector !== null && idSector > 0),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener intervenciones en una tubería específica
 */
export function usePipeInterventions(
  idPipes: number | null,
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.pipeInterventions(idPipes!, dateStart!, dateFinish!),
    queryFn: () => apiService.getInterventionsByPipes(idPipes!, dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      idPipes !== null &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener intervenciones en una conexión específica
 */
export function useConnectionInterventions(
  idConnection: number | null,
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.connectionInterventions(idConnection!, dateStart!, dateFinish!),
    queryFn: () => apiService.getInterventionsByConnections(idConnection!, dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      idConnection !== null &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte comparativo entre sectores
 */
export function useSectorComparative(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.sectorComparative(),
    queryFn: () => apiService.getSectorComparative(),
    enabled: options?.enabled !== undefined ? options.enabled : true,
    staleTime: 1000 * 60 * 10, // 10 minutos - los sectores no cambian frecuentemente
  });
}

/**
 * Hook para obtener reporte general de intervenciones
 */
export function useInterventions(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.interventionsGeneral(dateStart!, dateFinish!),
    queryFn: () => apiService.getInterventions(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener intervenciones por sector
 */
export function useInterventionsBySector(
  idSector: number | null,
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.interventionsBySector(idSector!, dateStart!, dateFinish!),
    queryFn: () => apiService.getInterventionsBySector(idSector!, dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      idSector !== null &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener frecuencia de intervenciones
 */
export function useInterventionFrequency(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.interventionFrequency(dateStart!, dateFinish!),
    queryFn: () => apiService.getInterventionFrequency(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de tanques
 */
export function useTanksReport(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.tanks(),
    queryFn: () => apiService.getTanksReport(),
    enabled: options?.enabled !== undefined ? options.enabled : true,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para obtener reporte de estado de tanques
 */
export function useTankStatusReport(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.tankStatus(),
    queryFn: () => apiService.getTankStatusReport(),
    enabled: options?.enabled !== undefined ? options.enabled : true,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de desvíos
 */
export function useDeviationsReport(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.deviations(),
    queryFn: () => apiService.getDeviationsReport(),
    enabled: options?.enabled !== undefined ? options.enabled : true,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de asignaciones
 */
export function useAssignmentsReport(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.assignmentsReport(dateStart!, dateFinish!),
    queryFn: () => apiService.getAssignmentsReport(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de asignaciones por estado
 */
export function useAssignmentsByStatusReport(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.assignmentsByStatus(dateStart!, dateFinish!),
    queryFn: () => apiService.getAssignmentsByStatusReport(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de fontanero específico
 */
export function usePlumberReport(
  employeeId: number | null,
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.plumberReport(employeeId!, dateStart!, dateFinish!),
    queryFn: () => apiService.getPlumberReport(employeeId!, dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      employeeId !== null &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener top fontaneros
 */
export function useTopPlumbersReport(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.topPlumbers(dateStart!, dateFinish!),
    queryFn: () => apiService.getTopPlumbersReport(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de operador específico
 */
export function useOperatorReport(
  employeeId: number | null,
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.operatorReport(employeeId!, dateStart!, dateFinish!),
    queryFn: () => apiService.getOperatorReport(employeeId!, dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      employeeId !== null &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener top operadores
 */
export function useTopOperatorsReport(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.topOperators(dateStart!, dateFinish!),
    queryFn: () => apiService.getTopOperatorsReport(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de lectores
 */
export function useReadersReport(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.readers(dateStart!, dateFinish!),
    queryFn: () => apiService.getReadersReport(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener top lectores
 */
export function useTopReadersReport(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.topReaders(dateStart!, dateFinish!),
    queryFn: () => apiService.getTopReadersReport(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener reporte de encargados de limpieza
 */
export function useCleanersReport(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.cleaners(),
    queryFn: () => apiService.getCleanersReport(),
    enabled: options?.enabled !== undefined ? options.enabled : true,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para obtener top encargados de limpieza
 */
export function useTopCleanersReport(
  dateStart: string | null,
  dateFinish: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.topCleaners(dateStart!, dateFinish!),
    queryFn: () => apiService.getTopCleanersReport(dateStart!, dateFinish!),
    enabled:
      (options?.enabled !== undefined ? options.enabled : true) &&
      dateStart !== null &&
      dateFinish !== null,
    staleTime: 1000 * 60 * 5,
  });
}
