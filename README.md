# Potentes API

API REST construida con Node.js, Express, TypeScript y Prisma para el proyecto Potentes.

## 🚀 Tecnologías

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- JWT para autenticación
- Zod para validación de datos

## 📋 Prerrequisitos

- Node.js (versión recomendada: 18.x o superior)
- PostgreSQL
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd potentes-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/potentes_db"
JWT_SECRET="tu_secreto_jwt"
PORT=3000
```

4. Ejecuta las migraciones de la base de datos:

```bash
npm run migrate
```

## 🚀 Uso

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000` (o el puerto que hayas configurado).

## 📁 Estructura del Proyecto

```
potentes-api/
├── src/
│   ├── controllers/    # Controladores de la aplicación
│   ├── middlewares/    # Middlewares personalizados
│   ├── routes/         # Rutas de la API
│   ├── services/       # Lógica de negocio
│   ├── types/          # Definiciones de tipos TypeScript
│   ├── utils/          # Utilidades y helpers
│   ├── app.ts          # Configuración de Express
│   └── index.ts        # Punto de entrada de la aplicación
├── prisma/
│   └── schema.prisma   # Esquema de la base de datos
├── .env               # Variables de entorno
├── package.json
└── tsconfig.json
```

## 🔑 Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática
- `npm run migrate`: Ejecuta las migraciones de la base de datos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
