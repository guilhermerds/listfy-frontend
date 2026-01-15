FROM node:20-alpine

WORKDIR /usr/app

# Copia e instala dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# ARGS para o build (necessário para o Vite injetar as envs no build)
ARG VITE_SERVER_URL
ARG VITE_WEBSOCKET_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_WEBSOCKET_URL=$VITE_WEBSOCKET_URL

# Gera a pasta 'dist' (Build de produção)
RUN npm run build

# Instala um servidor estático leve globalmente
RUN npm install -g serve

# Expõe a porta
EXPOSE 4000

# Roda o servidor apontando para a pasta dist gerada
CMD [ "serve", "-s", "dist", "-l", "4000" ]