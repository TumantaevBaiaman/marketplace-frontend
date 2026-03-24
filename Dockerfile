# ============================================================
# Stage 1: deps — устанавливаем зависимости
# ============================================================
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ============================================================
# Stage 2: dev — горячая перезагрузка (vite dev server)
# ============================================================
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ============================================================
# Stage 3: build — собираем статику
# ============================================================
FROM deps AS build
COPY . .
RUN npm run build

# ============================================================
# Stage 4: prod — отдаём статику через nginx
# ============================================================
FROM nginx:stable-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
