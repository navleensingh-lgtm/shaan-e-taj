FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
RUN npm ci -w @shaan-e-taj/api -w @shaan-e-taj/database --include-workspace-root
COPY apps/api ./apps/api
COPY packages/database ./packages/database
RUN npm run build -w @shaan-e-taj/database
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["npx", "tsx", "src/index.ts"]
