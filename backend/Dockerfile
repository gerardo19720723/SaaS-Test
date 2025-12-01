FROM node:20-alpine
WORKDIR /app

# Copiar manifiestos primero (layer cache)
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Arrancar
CMD ["node", "dist/index.js"]
