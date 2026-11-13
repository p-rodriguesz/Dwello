FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG API_URL=http://api:3000
ENV API_URL=$API_URL
RUN npm run build

FROM node:22-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
USER node
EXPOSE 3001
CMD ["npm", "run", "start"]
