# StockWise - Control de Stock Automatizado 🚀

**Gestión inteligente de inventario potenciada por IA**

StockWise es una aplicación web full-stack que permite gestionar el inventario de productos de forma eficiente. Incluye un panel de control con métricas en tiempo real, registro de movimientos (entradas/salidas), y un módulo de IA que analiza el inventario y genera recomendaciones automáticas.

## ✨ Funcionalidades

- **Dashboard** con métricas clave: total de productos, stock bajo, valor del inventario, movimientos del día
- **CRUD completo de productos**: crear, editar, eliminar con campos como nombre, SKU, categoría, precio, stock actual y mínimo
- **Registro de movimientos**: entradas y salidas de stock con motivo y actualización automática de cantidades
- **Alertas inteligentes**: productos con stock crítico (0 unidades) o bajo (por debajo del mínimo)
- **IA Insights**: análisis del inventario con recomendaciones generadas por IA (OpenAI GPT-3.5)
- **Estadísticas por categoría**: distribución de productos, unidades y valor por categoría
- **Interfaz responsive**: adaptable a escritorio y dispositivos móviles
- **Modo oscuro**: soporte para tema claro y oscuro

## 🛠 Tecnologías

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) |
| **Estilos** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Base de datos** | [SQLite](https://www.sqlite.org/) + [Prisma 7](https://www.prisma.io/) |
| **Iconos** | [Lucide React](https://lucide.dev/) |
| **Notificaciones** | [React Hot Toast](https://react-hot-toast.com/) |
| **IA** | [OpenAI API](https://platform.openai.com/) (GPT-3.5 Turbo) |

## 🤖 IA Utilizada

Este proyecto fue desarrollado con la asistencia de **Claude (Anthropic)** a través de **OpenCode IDE** como herramienta de pair programming. La IA colaboró en:

- Arquitectura inicial y diseño del schema de base de datos
- Generación de Server Actions y Server Components
- Implementación de la integración con OpenAI para el módulo de análisis
- Depuración de errores de compilación y configuración
- Documentación del proyecto

## 🚀 Guía Rápida

### Requisitos previos

- Node.js 18+ 
- npm 9+
- Una API Key de OpenAI (opcional, solo para el módulo IA)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/stockwise.git
cd stockwise

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar tu OPENAI_API_KEY (opcional)

# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones (crea la base de datos)
npx prisma migrate dev

# Iniciar el servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

### Construir para producción

```bash
npm run build
npm start
```

## 📂 Estructura del Proyecto

```
stockwise/
├── prisma/
│   ├── schema.prisma        # Schema de base de datos
│   └── migrations/          # Migraciones
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── page.tsx         # Dashboard
│   │   ├── layout.tsx       # Layout principal
│   │   ├── actions.ts       # Server Actions
│   │   ├── products/        # Páginas de productos
│   │   ├── movements/       # Página de movimientos
│   │   └── ai/              # Página de IA Insights
│   ├── components/
│   │   └── Navbar.tsx       # Barra de navegación
│   └── lib/
│       ├── prisma.ts        # Cliente de Prisma
│       └── openai.ts        # Integración con OpenAI
└── public/                  # Assets estáticos
```

## 🔧 Variables de Entorno

Creá un archivo `.env` basado en `.env.example`:

```env
# OpenAI API Key (opcional: necesaria solo para el módulo de IA Insights)
OPENAI_API_KEY=sk-tu-clave-aqui
```

## 📝 Licencia

MIT

---

Desarrollado con ❤️ y asistencia de IA para el Trabajo Práctico Integrador de Desarrollo Ágil Asistido por IA.
