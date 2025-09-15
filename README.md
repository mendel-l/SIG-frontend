# SIG-Frontend

Sistema de Información Geográfica (SIG) desarrollado para la Municipalidad de Palestina de Los Altos. Una aplicación web moderna construida con React que proporciona herramientas de gestión y visualización de información geográfica.

## 🚀 Características

- **Interfaz moderna y responsiva** con diseño limpio
- **Sistema de autenticación** seguro
- **Dashboard interactivo** con gráficos y métricas
- **Gestión de formularios** con validación
- **Componentes reutilizables** y modulares
- **Tema personalizable** con soporte para modo claro/oscuro

## 📋 Requisitos del Sistema

### Requisitos Mínimos
- **Node.js**: versión 16.0.0 o superior
- **npm**: versión 8.0.0 o superior
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Requisitos Recomendados
- **Node.js**: versión 18.20.8
- **npm**: versión 9.0.0 o superior
- **RAM**: 4GB mínimo, 8GB recomendado
- **Espacio en disco**: 2GB libres

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd SIG-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (opcional)
Crear un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

### 4. Ejecutar el proyecto
```bash
npm start
```

El proyecto se ejecutará en `http://localhost:3000`

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Ejecuta la aplicación en modo desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm test` | Ejecuta las pruebas unitarias |
| `npm run sass` | Compila los archivos SCSS a CSS |
| `npm run eject` | Expone la configuración de webpack (irreversible) |

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Contextos de React
├── css/               # Archivos CSS compilados
├── icons/             # Iconos y fuentes
├── images/            # Imágenes y assets
├── jsx/               # Componentes JSX principales
│   ├── components/    # Componentes específicos
│   ├── layouts/       # Layouts de página
│   ├── pages/         # Páginas de la aplicación
│   └── constant/      # Constantes y configuraciones
├── scss/              # Archivos SCSS fuente
├── store/             # Estado global (Redux)
└── App.js             # Componente principal
```

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 18.2.0** - Biblioteca principal
- **React Router DOM 6.10.0** - Enrutamiento
- **Redux Toolkit 1.9.7** - Gestión de estado
- **Bootstrap 5** - Framework CSS
- **SCSS** - Preprocesador CSS
- **Chart.js** - Gráficos y visualizaciones
- **ApexCharts** - Gráficos avanzados

### Herramientas de Desarrollo
- **React Scripts 5.0.1** - Herramientas de desarrollo
- **SASS 1.69.0** - Compilador SCSS
- **Axios 1.6.0** - Cliente HTTP
- **React Hook Form 7.47.0** - Manejo de formularios

## 🔧 Configuración Adicional

### Compilación de SCSS
Para compilar los archivos SCSS en tiempo real:
```bash
npm run sass
```

### Modo de Producción
Para crear una build optimizada:
```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `build/`.

## 🌐 Despliegue

### Despliegue en Netlify
1. Conecta tu repositorio a Netlify
2. Configura el comando de build: `npm run build`
3. Directorio de publicación: `build`
4. Despliega automáticamente

### Despliegue en Vercel
1. Conecta tu repositorio a Vercel
2. Framework: Create React App
3. Directorio raíz: `/`
4. Comando de build: `npm run build`
5. Directorio de salida: `build`

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
```bash
# En macOS/Linux
lsof -ti:3000 | xargs kill -9

# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error de permisos en macOS/Linux
```bash
sudo chown -R $(whoami) ~/.npm
```

## 📞 Soporte

Para reportar problemas o solicitar nuevas características:
1. Crear un issue en el repositorio
2. Describir el problema detalladamente
3. Incluir pasos para reproducir el error
4. Especificar versión de Node.js y navegador

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Contribuidores

- Wilver
- Mendel  
- Carlos
- Tony

---

**Desarrollado con ❤️ para la Municipalidad de Palestina de Los Altos**
