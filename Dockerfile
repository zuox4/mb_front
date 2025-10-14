FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY .env.prod .env
RUN npm install
COPY . .
RUN npx vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Создаем конфиг nginx на лету
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
