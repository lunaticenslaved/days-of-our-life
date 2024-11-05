ARG NODE_VERSION=20


FROM node:$NODE_VERSION-buster as builder

WORKDIR /src

COPY . .

RUN npm ci \
    && npm run db:generate \
    && npm run build \
    && chmod +x utils/wait-for.sh \
    && apt update \
    && apt install -y netcat-openbsd
