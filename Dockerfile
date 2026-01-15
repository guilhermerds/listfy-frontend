# --- ETAPA BASE (Comum a todos) ---
FROM node:20-alpine AS base
WORKDIR /usr/app
COPY package*.json ./
# Instala as dependências (incluindo devDependencies necessárias pro Vite)
RUN npm install

# --- ETAPA DE DESENVOLVIMENTO (Dev) ---
FROM base AS dev
# Copia o código (opcional aqui pois usaremos volumes, mas boa prática)
COPY . .
# Expõe a porta do Vite
EXPOSE 5173
# Roda o servidor de dev liberando o host (importante pro Docker)
CMD ["npm", "run", "dev", "--", "--host"]

# --- ETAPA DE BUILD (Produção - Compilação) ---
FROM base AS builder
COPY . .
# Argumentos de ambiente para o build
ARG VITE_SERVER_URL
ARG VITE_WEBSOCKET_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_WEBSOCKET_URL=$VITE_WEBSOCKET_URL
# Gera a pasta /dist
RUN npm run build

# --- ETAPA FINAL (Produção - Servidor Leve) ---
FROM node:20-alpine AS prod
WORKDIR /usr/app
# Instala apenas o servidor estático
RUN npm install -g serve
# Copia APENAS a pasta dist gerada na etapa anterior (builder)
COPY --from=builder /usr/app/dist ./dist
EXPOSE 4000
CMD [ "serve", "-s", "dist", "-l", "4000" ]