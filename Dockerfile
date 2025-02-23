# 1st Stage: Builder
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY ./src ./src
# COPY .env ./

RUN npx prisma generate

# 2nd Stage: Runner
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/prisma ./prisma
# COPY --from=builder /usr/src/app/.env ./
COPY package*.json ./

EXPOSE 8787

CMD ["npm", "start"]
