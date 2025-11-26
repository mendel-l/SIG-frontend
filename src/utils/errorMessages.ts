/**
 * Utilidades para manejar mensajes de error de forma amigable para el usuario
 */

/**
 * Obtiene un mensaje de error amigable basado en el error recibido
 */
export function getFriendlyErrorMessage(error: unknown, defaultMessage: string = 'Ocurrió un error inesperado'): string {
  // Si es un string, devolverlo directamente
  if (typeof error === 'string') {
    return sanitizeErrorMessage(error);
  }

  // Si es un Error, obtener su mensaje
  if (error instanceof Error) {
    return sanitizeErrorMessage(error.message);
  }

  // Si tiene una propiedad message
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return sanitizeErrorMessage(message);
    }
  }

  return defaultMessage;
}

/**
 * Sanitiza mensajes de error para ocultar detalles técnicos
 */
function sanitizeErrorMessage(message: string): string {
  // Detectar errores de base de datos y reemplazarlos completamente
  const databaseErrorPatterns: Array<[RegExp, string]> = [
    // Errores de PostgreSQL
    [/relation\s+["']?(\w+)["']?\s+does not exist/gi, 'No hay datos disponibles'],
    [/table\s+["']?(\w+)["']?\s+does not exist/gi, 'No hay datos disponibles'],
    [/UndefinedTable/gi, 'No hay datos disponibles'],
    [/psycopg2\.errors\./gi, ''],
    [/SQL:/gi, ''],
    [/\[SQL:.*?\]/gi, ''],
    [/\[parameters:.*?\]/gi, ''],
    [/\(Background on this error at:.*?\)/gi, ''],
    [/LINE \d+:/gi, ''],
    [/FROM \w+/gi, ''],
    [/SELECT.*?FROM/gi, ''],
    
    // Errores de SQLAlchemy
    [/sqlalchemy/gi, ''],
    [/SQLAlchemy/gi, ''],
    
    // Errores de conexión a base de datos
    [/could not connect/gi, 'No se pudo conectar con la base de datos'],
    [/connection refused/gi, 'No se pudo conectar con la base de datos'],
    [/database.*does not exist/gi, 'No hay datos disponibles'],
  ];

  // Mensajes técnicos comunes que deben ser reemplazados
  const technicalPatterns: Array<[RegExp, string]> = [
    // Errores HTTP
    [/Error \d{3}/gi, 'Error de conexión'],
    [/404/gi, 'No se encontró el recurso'],
    [/403/gi, 'No tienes permisos para realizar esta acción'],
    [/401/gi, 'Tu sesión ha expirado'],
    [/500/gi, 'Error del servidor'],
    [/Network Error/gi, 'Error de conexión'],
    [/Failed to fetch/gi, 'No se pudo conectar con el servidor'],
    
    // Errores técnicos comunes
    [/undefined/gi, ''],
    [/null/gi, ''],
    [/TypeError/gi, 'Error de datos'],
    [/ReferenceError/gi, 'Error de referencia'],
    [/SyntaxError/gi, 'Error de formato'],
    
    // Mensajes de desarrollo
    [/Cannot read property/gi, 'Error al procesar los datos'],
    [/is not defined/gi, 'Error de configuración'],
    [/Unexpected token/gi, 'Error de formato'],
    
    // Errores de validación comunes
    [/required/gi, 'Campo requerido'],
    [/invalid/gi, 'Dato inválido'],
    [/must be/gi, 'Debe ser'],
    
    // Errores genéricos del backend que contienen detalles técnicos
    [/Error al obtener.*?:/gi, ''],
    [/Error al crear.*?:/gi, ''],
    [/Error al actualizar.*?:/gi, ''],
    [/Error al eliminar.*?:/gi, ''],
  ];

  let sanitized = message;

  // Primero aplicar patrones de base de datos (más específicos)
  for (const [pattern, replacement] of databaseErrorPatterns) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  // Luego aplicar patrones técnicos generales
  for (const [pattern, replacement] of technicalPatterns) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  // Limpiar espacios múltiples y saltos de línea
  sanitized = sanitized.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();

  // Si el mensaje contiene palabras técnicas de SQL/DB, reemplazar completamente
  if (/SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|DATABASE|SQL|psycopg|postgres/i.test(sanitized)) {
    return 'No hay datos disponibles en este momento.';
  }

  // Si el mensaje está vacío después de la sanitización, usar mensaje por defecto
  if (!sanitized || sanitized.length < 3) {
    return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
  }

  // Capitalizar primera letra
  return sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
}

/**
 * Obtiene un mensaje de error específico según el contexto
 */
export function getContextualErrorMessage(
  context: 'load' | 'create' | 'update' | 'delete' | 'upload' | 'export',
  entity: string = 'los datos'
): string {
  const messages: Record<string, Record<string, string>> = {
    load: {
      default: `No se pudieron cargar ${entity}. Por favor, intenta nuevamente.`,
      network: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      server: 'El servidor no está disponible en este momento. Intenta más tarde.',
    },
    create: {
      default: `No se pudo crear ${entity}. Por favor, verifica los datos e intenta nuevamente.`,
      validation: 'Los datos proporcionados no son válidos. Por favor, revisa el formulario.',
      duplicate: `${entity} ya existe en el sistema.`,
    },
    update: {
      default: `No se pudo actualizar ${entity}. Por favor, intenta nuevamente.`,
      notFound: `${entity} no se encontró en el sistema.`,
      permission: 'No tienes permisos para actualizar este elemento.',
    },
    delete: {
      default: `No se pudo eliminar ${entity}. Por favor, intenta nuevamente.`,
      notFound: `${entity} no se encontró en el sistema.`,
      inUse: `No se puede eliminar ${entity} porque está en uso.`,
    },
    upload: {
      default: 'No se pudo subir el archivo. Por favor, verifica el formato e intenta nuevamente.',
      format: 'El formato del archivo no es válido. Verifica que sea el tipo correcto.',
      size: 'El archivo es demasiado grande. Por favor, reduce el tamaño.',
    },
    export: {
      default: 'No se pudo exportar los datos. Por favor, intenta nuevamente.',
      empty: 'No hay datos para exportar.',
    },
  };

  return messages[context]?.default || 'Ocurrió un error inesperado.';
}

