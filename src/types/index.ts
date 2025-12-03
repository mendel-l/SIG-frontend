// Permission types
export interface Permission {
  id_permissions: number;
  name: string;
  description: string;
  active: boolean;
}

export type PermissionName = 
  | 'view_users' | 'create_users' | 'edit_users' | 'delete_users'
  | 'view_roles' | 'create_roles' | 'edit_roles' | 'delete_roles'
  | 'view_permissions' | 'create_permissions' | 'edit_permissions' | 'delete_permissions'
  | 'view_tanks' | 'create_tanks' | 'edit_tanks' | 'delete_tanks'
  | 'view_pipes' | 'create_pipes' | 'edit_pipes' | 'delete_pipes'
  | 'view_connections' | 'create_connections' | 'edit_connections' | 'delete_connections'
  | 'view_interventions' | 'create_interventions' | 'edit_interventions' | 'delete_interventions'
  | 'view_employees' | 'create_employees' | 'edit_employees' | 'delete_employees'
  | 'view_type_employee' | 'create_type_employee' | 'edit_type_employee' | 'delete_type_employee'
  | 'view_reports' | 'export_reports'
  | 'view_dashboard' | 'view_map';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string; // Nombre del rol del backend (ej: "Administrador", "Usuario")
  roleId: number; // ID del rol
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface UserWithPermissions extends User {
  permissions: Permission[];
}

export type UserRole = 'admin' | 'user' | 'viewer'; // Mantener para compatibilidad, pero usar role: string

// Rol types
export interface Rol {
  id_rol: number;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolBase {
  name: string;
  description: string;
}

// TypeEmployee types
export interface TypeEmployee {
  id_type_employee: number;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TypeEmployeeBase {
  name: string;
  description: string;
  active?: boolean;
}

// Employee types
export interface Employee {
  id_employee: number;
  id_type_employee: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  type_employee?: TypeEmployee; // Relación opcional
}

export interface EmployeeBase {
  id_type_employee: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  active?: boolean;
}


export interface PermissionBase {
  name: string;
  description: string;
  active: boolean;
}

// Intervention types
export enum InterventionStatus {
  SIN_INICIAR = 'SIN INICIAR',
  EN_CURSO = 'EN CURSO',
  FINALIZADO = 'FINALIZADO'
}

export interface Intervention {
  id_interventions: number;
  description: string;
  start_date: string;
  end_date: string;
  status: InterventionStatus;
  active: boolean;
  photography: string[];
  created_at: string;
  updated_at: string;
}

export interface InterventionBase {
  description: string;
  start_date: string;
  end_date: string;
  status?: InterventionStatus;
  active: boolean;
  photography?: string[];
}

export interface InterventionCreate extends InterventionBase {
  // Las entidades se manejarán después en otra tabla
}

// Connection types
export interface Connection {
  id_connection: number;
  latitude: number;
  longitude: number;
  material: string;
  diameter_mn: number;
  pressure_nominal: string;
  connection_type: string;
  depth_m: number;
  installed_date: string;
  installed_by: string | null;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  pipes?: Array<{ id_pipes: number; material: string; diameter: number }>;
}

export interface ConnectionBase {
  latitude: number;
  longitude: number;
  material: string;
  diameter_mn: number;
  pressure_nominal: string;
  connection_type: string;
  depth_m: number;
  installed_date: string;
  installed_by?: string | null;
  description?: string | null;
  active?: boolean;
}

export interface ConnectionCreate extends ConnectionBase {
  pipe_ids?: number[];
}

// Bomb types
export interface Bomb {
  id_bombs: number;
  name: string;
  latitude: number;
  longitude: number;
  connections: string | null;
  photography: string[] | null;
  sector_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BombBase {
  name: string;
  latitude: number;
  longitude: number;
  connections?: string | null;
  photography?: string[];
  sector_id: number;
  active: boolean;
}

export interface BombCreate extends BombBase {
  // Inherits all fields from BombBase
}

export interface BombUpdate {
  name?: string;
  latitude?: number;
  longitude?: number;
  connections?: string | null;
  photography?: string[];
  sector_id?: number;
  active?: boolean;
}

// Pipe types
export interface Pipe {
  id: string;
  material: string;
  diameter: number;
  length: number;
  active: boolean;
  installationDate: string;
  location: string;
  observations: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipeBase {
  material: string;
  diameter: number;
  length: number;
  active: boolean;
  installationDate: string;
  location: string;
  observations?: string;
}

// Role Permission types
export interface RolePermission {
  id: string;
  roleId: string;
  roleName: string;
  permissionId: string;
  permissionName: string;
  permissionDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionBase {
  roleId: string;
  permissionId: string;
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Log types
export interface Log {
  log_id: number;
  user_id: number;
  action: string;
  entity?: string;
  entity_id?: number;
  description?: string;
  created_at: string;
}

export interface LogSummary {
  user_id: number;
  total_logins: number;
  last_login?: string;
  first_login?: string;
  login_dates: string[];
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalRevenue: number;
  growthRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// GIS types
export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface MapMarker {
  id: string;
  position: GeoLocation;
  title: string;
  description?: string;
  type: 'building' | 'landmark' | 'service' | 'emergency';
  data?: Record<string, any>;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'markers' | 'polygons' | 'lines';
  visible: boolean;
  data: any[];
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  primaryColor: string;
  sidebarCollapsed: boolean;
}

// Reports types
export type AssetType = 'Tanque' | 'Tubería' | 'Plomero';
export type EventType = 'Inspección' | 'Mantenimiento' | 'Reparación' | 'Lectura';
export type StatusType = 'OK' | 'Pendiente' | 'En curso' | 'Cerrado';
export type ZoneType = 'Norte' | 'Centro' | 'Sur' | 'Este' | 'Oeste';

export interface ReportRecord {
  id: number;
  fecha: string; // YYYY-MM-DD
  empleado_nombre: string;
  empleado_rol: string;
  activo_tipo: AssetType;
  activo_nombre: string;
  evento: EventType;
  duracion_minutos: number;
  estado: StatusType;
  zona: ZoneType;
  observaciones: string;
}

export interface ReportFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  entity?: string;
  employees?: number[];
  assetTypes?: AssetType[];
  assetIds?: number[];
  zones?: ZoneType[];
  statuses?: StatusType[];
  events?: EventType[];
}

export interface ActiveFilter {
  id: string;
  type: 'dateRange' | 'employee' | 'asset' | 'zone' | 'status' | 'event' | 'entity';
  label: string;
  value: any;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface DateRangePreset {
  label: string;
  value: 'today' | 'last7days' | 'thisMonth' | 'lastMonth' | 'custom';
  getRange: () => { start: string; end: string };
}

export interface EmployeeOption {
  id: number;
  name: string;
  role: string;
  email?: string;
}

export interface AssetOption {
  id: number;
  name: string;
  type: AssetType;
  code?: string;
  zone?: ZoneType;
}

export interface ExportOptions {
  format: 'pdf' | 'excel';
  includeFilters: boolean;
  fileName?: string;
}

// Report types - Tipos para reportes del backend
export interface ReportResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Reporte: Tuberías por Sector
export interface PipeBySectorReport {
  sector: {
    id_sector: number;
    name: string;
  };
  total_pipes: number;
  pipes: Array<{
    id_pipes: number;
    material: string;
    diameter: number;
    size: number;
    installation_date: string | null;
    distance: number | null;
    observations: string | null;
    active: boolean;
    total_connections: number;
    total_interventions: number;
  }>;
}

// Reporte: Intervenciones en Tuberías
export interface PipeInterventionsReport {
  pipe: {
    id_pipes: number;
    material: string;
    diameter: number;
    sector_id: number | null;
  };
  total_interventions: number;
  interventions: Array<{
    id_intervention: number;
    description: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    photography: string | null;
    assigned_to: string | null;
    assignment_status: string | null;
    assignment_notes: string | null;
  }>;
}

// Reporte: Intervenciones en Conexiones
export interface ConnectionInterventionsReport {
  connection: {
    id_connection: number;
    material: string;
    diameter: number;
  };
  total_interventions: number;
  interventions: Array<{
    id_intervention: number;
    description: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    photography: string | null;
    assigned_to: string | null;
    assignment_status: string | null;
    assignment_notes: string | null;
  }>;
}

// Reporte: Comparativo entre Sectores
export interface SectorComparativeReport {
  total_sectors: number;
  results: Array<{
    sector_id: number;
    sector_name: string;
    total_pipes: number;
    total_connections: number;
    interventions_pipes: number;
    interventions_connections: number;
    interventions_total: number;
  }>;
}

// Reporte: Intervenciones por Sector
export interface InterventionsBySectorReport {
  pipes: Array<{
    sector_name: string;
    count: number;
  }>;
  tanks: Array<{
    sector_name: string;
    count: number;
  }>;
  connections: Array<{
    sector_name: string;
    count: number;
  }>;
}

// Reporte: Frecuencia de Intervenciones
export interface InterventionFrequencyReport {
  description: string;
  cantidad: number;
}

// Reporte: Tanques
export interface TankReport {
  id_tank: number;
  name: string;
  coordinates: string | null;
  photos: string | null;
  created_at: string;
}

// Sector type
export interface Sector {
  id_sector: number;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Nuevos tipos de reportes

// Reporte: Estado de Tanques
export interface TankStatusReport {
  id_tank: number;
  name: string;
  state: string;
  coordinates: string | null;
  photos: string | null;
  created_at: string;
  total_interventions: number;
  last_intervention: string | null;
}

// Reporte: Desvíos (Conexiones)
export interface DeviationsReport {
  id_connection: number;
  sector: string | null;
  material: string | null;
  type: string | null;
  installed_date: string | null;
  coordinates: string | null;
  active: boolean;
  total_interventions: number;
}

// Reporte: Asignaciones
export interface AssignmentReportItem {
  id_assignment: number;
  assigned_at: string;
  status: string;
  notes: string | null;
  employee: {
    id: number;
    name: string;
  };
  intervention: {
    id: number;
    description: string;
    status?: string;
  };
}

export interface AssignmentsReport {
  total_assignments: number;
  assignments: AssignmentReportItem[];
}

// Reporte: Asignaciones por Estado
export interface AssignmentsByStatusReport {
  summary: Record<string, number>;
  total_assignments: number;
  assignments: AssignmentReportItem[];
}

// Reporte: Fontanero específico
export interface PlumberReport {
  id_employee: number;
  name: string;
  total_trabajos: number;
  asignado: number;
  en_proceso: number;
  completado: number;
}

// Reporte: Top Fontaneros
export interface TopPlumberReport {
  employee: string;
  id_employee: number;
  total_trabajos: number;
}

// Reporte: Operador específico
export interface OperatorReport {
  id_employee: number;
  name: string;
  total_trabajos: number;
  asignado: number;
  en_proceso: number;
  completado: number;
}

// Reporte: Top Operadores
export interface TopOperatorReport {
  employee: string;
  id_employee: number;
  total_trabajos: number;
}

// Reporte: Lectores
export interface ReaderReport {
  id_employee: number;
  nombre: string;
  actividad: number;
}

// Reporte: Top Lectores
export interface TopReaderReport {
  employee: string;
  id_employee: number;
  total_trabajos: number;
}

// Reporte: Encargados de Limpieza
export interface CleanerReport {
  id_employee: number;
  nombre: string;
  telefono: string | null;
  activo: boolean;
}

// Reporte: Top Encargados de Limpieza
export interface TopCleanerReport {
  id_employee: number;
  nombre: string;
  actividad: number;
}
