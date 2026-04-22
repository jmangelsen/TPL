FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_MAPBOX_TOKEN
ARG VITE_TX_TILESET_URL
ARG VITE_TX_SOURCE_LAYER
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY src ./src
COPY public ./public
COPY tsconfig.json ./
COPY firebase-applet-config.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "--experimental-strip-types", "server.ts"]
