# 1st Stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src ./src

# 2nd Stage
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/src ./src
COPY package*.json ./

EXPOSE 8787

CMD ["npm", "start"]
