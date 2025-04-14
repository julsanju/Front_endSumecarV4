# Etapa de construcción
FROM node:18 AS build
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir la aplicación usando npm en lugar de npx
RUN npm run build -- --configuration=production

# Etapa de servidor web (Nginx)
FROM nginx:latest
COPY --from=build /app/dist/tu-proyecto /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
