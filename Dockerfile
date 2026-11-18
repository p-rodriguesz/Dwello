FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY scripts ./scripts
COPY database ./database
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
RUN mkdir -p /app/storage/uploads && chown -R node:node /app/storage

USER node
EXPOSE 3000

CMD ["npm", "start"]
