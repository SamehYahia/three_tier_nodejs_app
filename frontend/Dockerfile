# Stage 1: Build the React application
FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Support Webpack 4 with OpenSSL 3 in Node 20
ENV NODE_OPTIONS=--openssl-legacy-provider
# Bypass legacy ESLint incompatibility in react-scripts 4.0.3
ENV DISABLE_ESLINT_PLUGIN=true
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: Hardened non-root Nginx runtime
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["wget", "-qO-", "http://127.0.0.1:8080/healthz"]

CMD ["nginx", "-g", "daemon off;"]