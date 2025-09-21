# SIG Frontend Moderno

Sistema de Información Geográfica moderno para la Municipalidad de Palestina de Los Altos, construido con las tecnologías más recientes.

## 🚀 Características

- **React 19** - Última versión con mejoras significativas
- **TypeScript 5.7** - Tipado estático para mejor desarrollo
- **Vite 6** - Build tool ultra rápido
- **Tailwind CSS 4** - Framework CSS utility-first moderno
- **Zustand 5** - Gestión de estado ligera y eficiente
- **React Router v7** - Enrutamiento moderno
- **Leaflet** - Mapas interactivos
- **React Hook Form + Zod** - Formularios con validación TypeScript-first
- **Framer Motion** - Animaciones fluidas
- **Lucide React** - Iconos modernos

## 📋 Requisitos del Sistema

### ⚠️ IMPORTANTE: Actualización de Node.js Requerida

**Tu versión actual:** Node.js 10.23.0 (muy antigua)
**Versión requerida:** Node.js 18+ (recomendado 20+)

### Instrucciones para Actualizar Node.js

#### Opción 1: Usando Node Version Manager (NVM) - Recomendado
```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reiniciar terminal o ejecutar:
source ~/.bashrc

# Instalar Node.js 20 (LTS)
nvm install 20
nvm use 20
nvm alias default 20

# Verificar instalación
node --version  # Debería mostrar v20.x.x
npm --version   # Debería mostrar 10.x.x
```

#### Opción 2: Descarga Directa
1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (20.x.x)
3. Instala siguiendo las instrucciones
4. Reinicia tu terminal

#### Opción 3: Usando Homebrew (macOS)
```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node@20

# Agregar al PATH
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd sig-frontend-modern
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar el proyecto
```bash
npm run dev
```

El proyecto se ejecutará en `http://localhost:3000`

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecuta la aplicación en modo desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta el linter |
| `npm run type-check` | Verifica los tipos de TypeScript |

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI básicos
│   ├── auth/           # Componentes de autenticación
│   └── layout/         # Componentes de layout
├── pages/              # Páginas de la aplicación
├── hooks/              # Hooks personalizados
├── stores/             # Estado global (Zustand)
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Funciones utilitarias
└── assets/             # Recursos estáticos
```

## 🎨 Tecnologías Utilizadas

### Frontend Core
- **React 19** - Biblioteca principal con nuevas características
- **TypeScript 5.7** - Tipado estático
- **Vite 6** - Build tool y servidor de desarrollo

### UI y Estilos
- **Tailwind CSS 4** - Framework CSS utility-first
- **Headless UI** - Componentes accesibles
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos

### Estado y Datos
- **Zustand 5** - Gestión de estado
- **React Hook Form 7** - Manejo de formularios
- **Zod 3** - Validación de esquemas

### Mapas y Visualización
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración con React
- **Recharts** - Gráficos y visualizaciones

### Herramientas de Desarrollo
- **ESLint 9** - Linting
- **TypeScript ESLint** - Linting específico para TypeScript
- **PostCSS** - Procesamiento de CSS

## 🔧 Configuración Adicional

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=SIG Municipal
VITE_APP_VERSION=1.0.0
```

### Configuración de Tailwind
El archivo `tailwind.config.js` incluye:
- Colores personalizados para el tema
- Fuentes personalizadas
- Animaciones personalizadas
- Configuración para modo oscuro

## 🌐 Despliegue

### Despliegue en Vercel
1. Conecta tu repositorio a Vercel
2. Framework: Vite
3. Directorio raíz: `/`
4. Comando de build: `npm run build`
5. Directorio de salida: `dist`

### Despliegue en Netlify
1. Conecta tu repositorio a Netlify
2. Comando de build: `npm run build`
3. Directorio de publicación: `dist`
4. Despliega automáticamente

## 🆚 Comparación con el Proyecto Anterior

| Aspecto | Proyecto Anterior | Proyecto Nuevo |
|---------|------------------|----------------|
| **React** | 18.2.0 | 19.1.0 |
| **Build Tool** | Create React App | Vite 6 |
| **CSS** | Bootstrap + SCSS | Tailwind CSS 4 |
| **Estado** | Redux Toolkit | Zustand 5 |
| **Tipado** | JavaScript | TypeScript 5.7 |
| **Mapas** | Múltiples librerías | Leaflet + React Leaflet |
| **Formularios** | React Hook Form | React Hook Form + Zod |
| **Iconos** | Múltiples fuentes | Lucide React |
| **Animaciones** | CSS básico | Framer Motion |

## 🐛 Solución de Problemas

### Error: "Node version incompatible"
**Solución:** Actualiza Node.js a la versión 18 o superior siguiendo las instrucciones arriba.

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

## 🚀 Próximos Pasos

1. **Actualizar Node.js** a la versión 18+
2. **Instalar dependencias** con `npm install`
3. **Ejecutar el proyecto** con `npm run dev`
4. **Personalizar** colores y configuración según necesidades
5. **Integrar** con tu API backend
6. **Desplegar** en tu plataforma preferida

## 📞 Soporte

Para reportar problemas o solicitar nuevas características:
1. Crear un issue en el repositorio
2. Describir el problema detalladamente
3. Incluir pasos para reproducir el error
4. Especificar versión de Node.js y navegador

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Contribuidores

- Carlos
- Mendel  
- Wilver
- Edwin

---

**Desarrollado con ❤️ para la Municipalidad de Palestina de Los Altos**

*Proyecto completamente modernizado con las tecnologías más recientes del ecosistema React.*
