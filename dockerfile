# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copiar dependencias y schema primero
COPY package*.json ./
COPY prisma ./prisma/

# Limpiar caché y instalar dependencias
RUN npm cache clean --force && npm ci --legacy-peer-deps

# Generar cliente Prisma ANTES de compilar (TypeScript necesita @prisma/client)
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Etapa 2: Producción
FROM node:20-slim AS production

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar archivos necesarios
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Variables de entorno para Prisma
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]