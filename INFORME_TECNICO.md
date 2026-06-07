# Informe Técnico - StockWise

## Trabajo Práctico Integrador: Desarrollo Ágil Asistido por IA

---

## 1. Descripción del Proyecto

StockWise es una aplicación web para el control de stock e inventario automatizado. Permite a los usuarios gestionar productos, registrar movimientos de entrada/salida, y recibir recomendaciones inteligentes generadas por IA para optimizar la gestión del inventario.

El proyecto fue desarrollado como un **Trabajo Práctico Integrador** para la materia de Desarrollo Ágil Asistido por IA, demostrando cómo las herramientas modernas de inteligencia artificial pueden acelerar y mejorar el proceso de desarrollo de software.

---

## 2. Arsenal de Herramientas IA Utilizadas

| Herramienta | Rol | Uso en el proyecto |
|-------------|-----|-------------------|
| **Claude (Anthropic)** | Asistente principal | Generación de código, arquitectura, resolución de errores |
| **OpenCode IDE** | Entorno de desarrollo | Integración con Claude para pair programming |
| **Google Gemini 2.0 Flash** | Motor de IA en la app | Análisis de inventario y generación de recomendaciones (API gratuita) |

### Cómo se utilizó cada herramienta:

- **Claude + OpenCode**: Actuó como pair programmer durante todo el desarrollo. Generó la estructura del proyecto, implementó las funcionalidades, y ayudó a resolver problemas de configuración (como la integración de Prisma v7 con SQLite y el driver adapter).

- **Google Gemini API**: Integrada directamente en la aplicación para el módulo de "IA Insights". Se eligió por su capa gratuita generosa (1500 requests/día) que no requiere tarjeta de crédito, ideal para un proyecto académico.

---

## 3. Sinergia con la IA

### Programación asistida
La IA fue fundamental para:
- **Scaffolding inicial**: Generación del proyecto Next.js con todas las dependencias necesarias
- **Schema de base de datos**: Diseño de modelos Product y Movement con relaciones
- **Server Actions**: Implementación de mutaciones seguras usando Server Functions de React
- **Componentes UI**: Creación de páginas completas con Tailwind CSS

### Depuración
La IA ayudó a resolver:
- **Error de módulo no encontrado**: El path alias `@/generated/prisma` requería importación desde el subarchivo `client`
- **Error de constructor PrismaClient**: Prisma v7 requiere un driver adapter explícito (`@prisma/adapter-better-sqlite3`)
- **Error de prerenderizado**: Las páginas que consumen base de datos necesitaban `export const dynamic = "force-dynamic"`
- **Error de API Key**: El cliente OpenAI se inicializaba en el scope del módulo y fallaba sin credenciales

### Testing y validación
La compilación y build del proyecto fueron verificadas múltiples veces, iterando sobre los errores hasta lograr una build limpia.

---

## 4. Lecciones Aprendidas

### Desafíos enfrentados

1. **Prisma v7 cambió su API**: La nueva versión requiere adaptadores de driver explícitos. La documentación no es tan abundante como para versiones anteriores, lo que requirió investigación adicional.

2. **Next.js 16 + Turbopack**: El nuevo bundler tiene comportamientos diferentes en cuanto a resolución de módulos y prerenderizado. Fue necesario leer la documentación incluida en `node_modules/next/dist/docs/`.

3. **Base de datos en build time**: Las páginas que consultan la base de datos durante el build necesitan ser marcadas como dinámicas, o asegurarse de que la base de datos existe y está poblada en el entorno de build.

4. **Coordinación de tools**: El uso de múltiples herramientas (Claude, OpenAI API, Prisma, Next.js) requiere entender bien cómo interactúan entre sí. La IA fue clave para navegar esta complejidad.

### Lo que funcionó bien
- La integración de Server Actions de Next.js con Prisma resultó muy natural y productiva
- Tailwind CSS permitió crear una UI profesional con poco esfuerzo
- La separación de responsabilidades (acciones en `app/actions.ts`, lógica de IA en `lib/openai.ts`) mantuvo el código organizado

### Lo que se podría mejorar
- Agregar autenticación de usuarios para multi-tenencia
- Implementar WebSockets para actualizaciones en tiempo real
- Migrar a PostgreSQL para entornos de producción más robustos

---

## 5. Estructura del Proyecto

```
stockwise/
├── prisma/
│   ├── schema.prisma              # Modelos: Product, Movement
│   └── migrations/                # Migración inicial
├── src/
│   ├── app/
│   │   ├── page.tsx               # Dashboard con métricas
│   │   ├── layout.tsx             # Layout con Navbar y Toaster
│   │   ├── globals.css            # Estilos globales Tailwind
│   │   ├── actions.ts             # Server Actions (CRUD + movimientos)
│   │   ├── products/
│   │   │   ├── page.tsx           # Listado de productos
│   │   │   ├── new/page.tsx       # Formulario de creación
│   │   │   └── [id]/edit/page.tsx # Formulario de edición
│   │   ├── movements/
│   │   │   └── page.tsx           # Registro y listado de movimientos
│   │   └── ai/
│   │       └── page.tsx           # Panel de IA Insights
│   ├── components/
│   │   └── Navbar.tsx             # Navegación responsive
│   └── lib/
│       ├── prisma.ts              # Singleton del cliente Prisma
│       └── openai.ts              # Cliente Gemini + helpers de análisis
├── .github/workflows/deploy.yml    # CI/CD con GitHub Actions
├── README.md                       # Documentación del proyecto
└── INFORME_TECNICO.md             # Este informe
```

---

## 6. Prompt Engineering

### Prompts clave utilizados durante el desarrollo:

**Prompt de arquitectura inicial:**
> "Crear un proyecto Next.js con TypeScript, Tailwind, Prisma y SQLite para control de stock con IA"

**Prompt de integración IA:**
> "Analizar el inventario y generar recomendaciones prácticas en español usando Gemini 2.0 Flash"

**Prompt de debugging:**
> "El build falla con 'Module not found: Can't resolve @/generated/prisma' - ¿cómo se resuelve con Prisma v7?"

### Lo que funcionó mejor:
- Ser específico en los prompts (tecnologías exactas, versiones)
- Incluir el mensaje de error completo para debugging
- Iterar sobre los problemas uno a la vez

### Donde falló la IA:
- La IA inicialmente no sabía que Prisma v7 requiere un adapter explícito
- Se requirieron múltiples iteraciones para resolver la configuración de la base de datos
- Se migró de OpenAI a Gemini por ser una alternativa gratuita para uso académico sin tarjeta de crédito
- El deploy en Vercel falló por no generar el cliente de Prisma antes del build. Se solucionó con `postinstall` + `prisma generate` en el script de build
- SQLite local no es compatible con Vercel (serverless, sin filesystem). Se migró a Turso (SQLite cloud) con adapter `@prisma/adapter-libsql`
- La API de Gemini 2.0 Flash tiene límites de cuota gratuita que requieren manejo de errores

---

## 7. Checklist del Éxito ✅

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Repo público creado y compartido con el docente | ✅ [github.com/Renzo96/TPI-Desarrollo-Software](https://github.com/Renzo96/TPI-Desarrollo-Software) |
| 2 | Pipeline de CI/CD configurado (deploy automático en Vercel) | ✅ GitHub Actions → Vercel en cada push a `main` |
| 3 | Informe de herramientas: ¿Qué prompt funcionó mejor? ¿En qué falló la IA? | ✅ Este documento |
| 4 | Demo funcional: link directo para probar el sistema | ✅ [tpi-desarrollo-software-wpxy.vercel.app](https://tpi-desarrollo-software-wpxy.vercel.app) |

### Funcionalidades del deploy

| Funcionalidad | Estado |
|--------------|--------|
| Dashboard con métricas | ✅ Funcionando |
| CRUD de productos | ✅ Funcionando |
| Registro de movimientos | ✅ Funcionando |
| Alertas de stock bajo | ✅ Funcionando |
| IA Insights (Gemini 2.0 Flash) | ⚠️ Sujeto a cuota gratuita |
| Modo oscuro | ✅ Funcionando |
| Responsive design | ✅ Funcionando |

### Base de datos en producción

- **Turso** (SQLite cloud) con URL `libsql://desarrollo-software-tpi-renzo.aws-us-east-2.turso.io`
- Adapter: `@prisma/adapter-libsql`
- Schema: Product (11 columnas) + Movement (6 columnas) con relación FK

---

*Informe generado como parte del Trabajo Práctico Integrador - Junio 2026*
