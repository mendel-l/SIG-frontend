// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'user' | 'viewer';

// Rol types
export interface Rol {
  id_rol: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface RolBase {
  name: string;
  description: string;
  status: number;
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
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
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
  employees?: number[];
  assetTypes?: AssetType[];
  assetIds?: number[];
  zones?: ZoneType[];
  statuses?: StatusType[];
  events?: EventType[];
}

export interface ActiveFilter {
  id: string;
  type: 'dateRange' | 'employee' | 'asset' | 'zone' | 'status' | 'event';
  label: string;
  value: any;
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
