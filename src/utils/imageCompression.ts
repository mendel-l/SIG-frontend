/**
 * Utilidades para compresión y optimización de imágenes
 * Mejora la calidad visual mientras reduce el tamaño de archivo
 */

export interface CompressionConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeMB: number;
  format: 'webp' | 'jpeg';
  maintainAspectRatio: boolean;
}

export interface CompressionResult {
  compressedImage: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dimensions: {
    width: number;
    height: number;
  };
}

// Configuración por defecto optimizada para fotos de tanques
export const DEFAULT_CONFIG: CompressionConfig = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.87,
  maxSizeMB: 0.5,
  format: 'webp',
  maintainAspectRatio: true
};

/**
 * Verifica si el navegador soporta WebP
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Calcula las dimensiones óptimas manteniendo el aspect ratio
 */
export const calculateOptimalDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  
  let newWidth = maxWidth;
  let newHeight = newWidth / aspectRatio;
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  };
};

/**
 * Redimensiona una imagen usando Canvas
 */
export const resizeImage = (
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement => {
  const resizedCanvas = document.createElement('canvas');
  const ctx = resizedCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto del canvas');
  }
  
  resizedCanvas.width = targetWidth;
  resizedCanvas.height = targetHeight;
  
  // Usar algoritmo de interpolación suave para mejor calidad
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
  
  return resizedCanvas;
};

/**
 * Aplica filtros de mejora de calidad a la imagen
 */
export const enhanceImageQuality = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Aplicar ligero sharpening y ajuste de contraste
  for (let i = 0; i < data.length; i += 4) {
    // Ajustar contraste ligeramente (1.05 = 5% más contraste)
    data[i] = Math.min(255, data[i] * 1.05);     // R
    data[i + 1] = Math.min(255, data[i + 1] * 1.05); // G  
    data[i + 2] = Math.min(255, data[i + 2] * 1.05); // B
    // Alpha channel (data[i + 3]) se mantiene igual
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

/**
 * Convierte canvas a base64 con el formato y calidad especificados
 */
export const canvasToBase64 = async (
  canvas: HTMLCanvasElement,
  format: 'webp' | 'jpeg',
  quality: number
): Promise<string> => {
  const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
  
  return new Promise((resolve, reject) => {
    try {
      const base64 = canvas.toDataURL(mimeType, quality);
      resolve(base64);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Calcula el tamaño de un string base64 en bytes
 */
export const getBase64Size = (base64String: string): number => {
  const base64Length = base64String.length - (base64String.indexOf(',') + 1);
  return Math.round((base64Length * 3) / 4);
};

/**
 * Función principal de compresión de imágenes
 */
export const compressImage = async (
  imageBase64: string,
  config: Partial<CompressionConfig> = {}
): Promise<CompressionResult> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => {
      try {
        // Crear canvas con la imagen original
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('No se pudo crear el contexto del canvas');
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Calcular dimensiones óptimas
        const optimalDimensions = calculateOptimalDimensions(
          img.width,
          img.height,
          finalConfig.maxWidth,
          finalConfig.maxHeight
        );
        
        // Redimensionar si es necesario
        let finalCanvas = canvas;
        if (optimalDimensions.width !== img.width || optimalDimensions.height !== img.height) {
          finalCanvas = resizeImage(canvas, optimalDimensions.width, optimalDimensions.height);
        }
        
        // Aplicar mejoras de calidad
        finalCanvas = enhanceImageQuality(finalCanvas);
        
        // Determinar formato final
        const useWebP = finalConfig.format === 'webp' && await supportsWebP();
        const finalFormat = useWebP ? 'webp' : 'jpeg';
        const finalQuality = useWebP ? finalConfig.quality : finalConfig.quality * 0.9; // JPEG necesita menos calidad
        
        // Comprimir y convertir
        let compressedBase64 = await canvasToBase64(finalCanvas, finalFormat, finalQuality);
        
        // Si aún es muy grande, reducir calidad gradualmente
        let currentQuality = finalQuality;
        let attempts = 0;
        const maxSizeBytes = finalConfig.maxSizeMB * 1024 * 1024;
        
        while (getBase64Size(compressedBase64) > maxSizeBytes && currentQuality > 0.3 && attempts < 5) {
          currentQuality *= 0.85;
          compressedBase64 = await canvasToBase64(finalCanvas, finalFormat, currentQuality);
          attempts++;
        }
        
        // Calcular métricas
        const originalSize = getBase64Size(imageBase64);
        const compressedSize = getBase64Size(compressedBase64);
        const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
        
        console.log(`📸 Compresión exitosa:
          - Formato: ${finalFormat.toUpperCase()}
          - Resolución: ${optimalDimensions.width}x${optimalDimensions.height}
          - Tamaño original: ${(originalSize / 1024).toFixed(1)}KB
          - Tamaño comprimido: ${(compressedSize / 1024).toFixed(1)}KB
          - Reducción: ${compressionRatio.toFixed(1)}%
          - Calidad final: ${(currentQuality * 100).toFixed(0)}%`);
        
        resolve({
          compressedImage: compressedBase64,
          originalSize,
          compressedSize,
          compressionRatio,
          dimensions: optimalDimensions
        });
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };
    
    img.src = imageBase64;
  });
};

/**
 * Procesa múltiples imágenes en lote
 */
export const compressImageBatch = async (
  images: string[],
  config: Partial<CompressionConfig> = {}
): Promise<CompressionResult[]> => {
  const results: CompressionResult[] = [];
  
  for (let i = 0; i < images.length; i++) {
    try {
      const result = await compressImage(images[i], config);
      results.push(result);
    } catch (error) {
      console.error(`Error comprimiendo imagen ${i + 1}:`, error);
      // En caso de error, mantener imagen original
      results.push({
        compressedImage: images[i],
        originalSize: getBase64Size(images[i]),
        compressedSize: getBase64Size(images[i]),
        compressionRatio: 0,
        dimensions: { width: 0, height: 0 }
      });
    }
  }
  
  return results;
};