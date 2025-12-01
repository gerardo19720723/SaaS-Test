FROM node:20-alpine
WORKDIR /app

# copiar manifests
COPY package*.json ./
# instalar TODAS las deps (incluye dev)
RUN npm install

# copiar código fuente
COPY . .

# build de Astro
RUN npm run build

# exponer puerto
EXPOSE 4321

# arrancar el servidor SSR
CMD ["node", "dist/server/entry.mjs"]