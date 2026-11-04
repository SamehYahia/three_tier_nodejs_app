# Stage 1: Install production dependencies
FROM node:20-alpine3.20 AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Hardened production runtime
FROM node:20-alpine3.20 AS runtime

# Install dumb-init for proper PID 1 signal forwarding and remove npm/corepack to reduce attack surface
RUN apk add --no-cache dumb-init=1.2.5-r3 && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack

ENV NODE_ENV=production
WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy application source code
COPY --chown=node:node . .

# Run as non-root user (UID 1000)
USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "require('http').get('http://localhost:3001/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]