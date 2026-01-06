# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
# Stage 2: Serve
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY --from=build /app/dist/app-cobranza/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /docker-entrypoint.d/99-custom-entrypoint.sh

RUN chmod +x /docker-entrypoint.d/99-custom-entrypoint.sh

# The official nginx image runs /docker-entrypoint.d/ scripts automatically
# Use the default command which starts nginx
CMD ["nginx", "-g", "daemon off;"]
